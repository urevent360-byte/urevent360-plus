'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  getIdTokenResult,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';

import { auth } from '@/lib/firebase/authClient'; // Correct: Import client-side auth
import { db } from '@/lib/firebase/client'; // Import firestore

// --- Types & Interfaces ---

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  updateProfile?: (profileData: {
    displayName?: string | null;
    photoURL?: string | null;
  }) => Promise<void>;
}

// --- Hardcoded Admin Emails ---
// A simple, first-layer check for admin access.
const ADMIN_EMAILS = new Set(['info@urevent360.com']);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Route Definitions ---

const publicRoutes = new Set<string>([
  '/',
  '/services',
  '/contact',
  '/gallery',
  '/plan',
  '/orlando-event-planning',
  '/corporate-event-production-orlando',
  '/wedding-entertainment-orlando',
  '/quinceanera-entertainment-orlando',
  '/sweet-16-entertainment-orlando',
  '/birthday-party-entertainment-orlando',
  '/baby-shower-entertainment-orlando',
  '/prom-entertainment-orlando',
]);

const publicPrefixes = ['/services/', '/solutions/', '/venues/', '/upload/'];
const adminAuthPages = new Set<string>(['/admin/login', '/admin/forgot-password']);
const appAuthPages = new Set<string>(['/app/login', '/app/register', '/app/forgot-password']);

const isAdminArea = (p: string) => p === '/admin' || p.startsWith('/admin/');
const isAppArea = (p: string) => p === '/app' || p.startsWith('/app/');
const isPublicRoute = (p: string) =>
  publicRoutes.has(p) || publicPrefixes.some((prefix) => p.startsWith(prefix));

// --- AuthProvider Component ---

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();
  const pathname = usePathname() ?? '/';

  // --- Multi-layered Admin Check ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      let userIsAdmin = false;

      // 1. Check hardcoded email list
      if (u.email && ADMIN_EMAILS.has(u.email.toLowerCase())) {
        userIsAdmin = true;
      }

      // 2. Check for custom claim (overrides email list if false)
      try {
        const idTokenResult = await getIdTokenResult(u, true); // Force refresh
        if (idTokenResult.claims.admin === true) {
          userIsAdmin = true;
        }
      } catch (error) {
        console.warn('Could not get custom claims:', error);
      }
      
      // 3. Check for Firestore role as a fallback
      if (!userIsAdmin) {
        try {
          const adminDocSnap = await getDoc(doc(db, 'admins', u.uid));
          if (adminDocSnap.exists()) {
             const data = adminDocSnap.data() as { role?: string; active?: boolean };
             const role = (data?.role ?? '').toString().toLowerCase();
             const allowed = new Set(['admin', 'owner', 'super admin']);
             if (allowed.has(role) && (data?.active === undefined || data?.active === true)) {
                 userIsAdmin = true;
             }
          }
        } catch (error) {
            console.warn('Could not check Firestore admin role:', error);
        }
      }

      setIsAdmin(userIsAdmin);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Redirection Logic ---
  useEffect(() => {
    if (loading) return;

    if (!user) {
      if (isAdminArea(pathname) && !adminAuthPages.has(pathname)) {
        router.replace('/admin/login');
      } else if (isAppArea(pathname) && !appAuthPages.has(pathname)) {
        router.replace('/app/login');
      }
      return;
    }

    if (isAdmin) {
      if (isAppArea(pathname) || pathname === '/admin' || adminAuthPages.has(pathname)) {
        router.replace('/admin/dashboard');
      }
    } else { // Host user
      if (isAdminArea(pathname)) {
        router.replace('/app/home');
      } else if (pathname === '/app' || appAuthPages.has(pathname)) {
        router.replace('/app/home');
      }
    }
  }, [loading, user, isAdmin, pathname, router]);

  const signOut = async () => {
    const inAdminArea = isAdminArea(pathname);
    await firebaseSignOut(auth);
    router.push(inAdminArea ? '/admin/login' : '/app/login');
  };
  
  const updateProfile = async (profileData: { displayName?: string | null; photoURL?: string | null }) => {
    if (auth.currentUser) {
      await firebaseUpdateProfile(auth.currentUser, profileData);
      // Create a new user object to trigger re-render in consumers
      setUser({ ...auth.currentUser });
    }
  };


  const value = useMemo<AuthContextType>(
    () => ({ user, loading, isAdmin, signOut, updateProfile }),
    [user, loading, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
