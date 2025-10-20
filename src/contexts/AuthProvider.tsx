
'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '@/lib/firebase/authClient';
import { db } from '@/lib/firebase/client';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => void;
  updateProfile?: (profileData: { displayName?: string | null; photoURL?: string | null }) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Public routes and regexes that don't require login
const publicRoutes = [
  '/',
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
];
const servicesRegex = /^\/services(\/.*)?$/;
const solutionsRegex = /^\/solutions(\/.*)?$/;
const venuesRegex = /^\/venues(\/.*)?$/;
const uploadRegex = /^\/upload(\/.*)?$/;

// Special auth pages that should be accessible when logged out
const adminAuthPages = ['/admin/login', '/admin/forgot-password'];
const appAuthPages = ['/app/login', '/app/register', '/app/forgot-password'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname() ?? '';
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setLoading(true);
      setUser(u);

      let userIsAdmin = false;
      if (u) {
        try {
          const adminDocRef = doc(db, 'admins', u.uid);
          const adminDoc = await getDoc(adminDocRef);
          if (adminDoc.exists()) {
            const data = adminDoc.data();
            const allowed = new Set(['admin', 'owner']);
            if (data?.active === true && allowed.has(String(data?.role ?? '').toLowerCase())) {
              userIsAdmin = true;
            }
          }
        } catch (error: any) {
          // Be tolerant: if rules deny or any read issue, just treat as non-admin.
          // Only log silently; do not show toast.
          if (error?.code !== 'permission-denied') {
            // Optional: console.debug('Admin check error', error);
          }
          userIsAdmin = false;
        }
      }
      setIsAdmin(userIsAdmin);
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  useEffect(() => {
    if (loading) return; // Wait until auth state is resolved

    const isPublic =
      publicRoutes.includes(pathname) ||
      servicesRegex.test(pathname) ||
      solutionsRegex.test(pathname) ||
      venuesRegex.test(pathname) ||
      uploadRegex.test(pathname);

    const isAdminAuthPage = adminAuthPages.includes(pathname);
    const isAppAuthPage = appAuthPages.includes(pathname);
    
    if (user) { // User is logged in
      if (isAdmin) {
        // Logged in as Admin
        if (isAdminAuthPage) {
          router.replace('/admin/home');
        }
      } else {
        // Logged in as Host
        if (isAppAuthPage) {
          router.replace('/app/home');
        }
      }
    } else { // User is logged out
      const isProtectedAdminRoute = pathname.startsWith('/admin/') && !isAdminAuthPage;
      const isProtectedAppRoute = pathname.startsWith('/app/') && !isAppAuthPage;

      if (isProtectedAdminRoute) {
        router.replace('/admin/login');
      } else if (isProtectedAppRoute) {
        router.replace('/app/login');
      }
    }
  }, [loading, user, isAdmin, pathname, router]);

  const signOut = async () => {
    const isAdminPath = pathname.startsWith('/admin');
    await firebaseSignOut(auth);
    // State will be cleared by onAuthStateChanged listener
    router.push(isAdminPath ? '/admin/login' : '/app/login');
  };

  const updateProfile = async (profileData: { displayName?: string | null; photoURL?: string | null }) => {
    if (auth.currentUser) {
      await firebaseUpdateProfile(auth.currentUser, profileData);
      setUser({ ...auth.currentUser }); // Force re-render with updated info
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
