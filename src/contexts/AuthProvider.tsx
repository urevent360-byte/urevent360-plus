
'use client';

import React, { ReactNode } from 'react';
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
import { errorEmitter } from '@/lib/firebase/error-emitter';
import { FirestorePermissionError } from '@/lib/firebase/errors';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => void;
  updateProfile?: (profileData: { displayName?: string | null; photoURL?: string | null }) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Public routes and regexes
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const router = useRouter();
  const rawPathname = usePathname();
  // 🔒 Normalize pathname to a non-null string for TS safety
  const pathname = rawPathname ?? '';

  const { toast } = useToast();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setLoading(true);
      setUser(u);

      let userIsAdmin = false;

      if (u) {
        try {
          const adminDocRef = doc(db, 'admins', u.uid);
          const adminDoc = await getDoc(adminDocRef);
          if (adminDoc.exists() && adminDoc.data().active === true && adminDoc.data().role) {
            userIsAdmin = true;
          }
        } catch (error: any) {
          if (error?.code === 'permission-denied') {
            errorEmitter.emit(
              'permission-error',
              new FirestorePermissionError({ operation: 'get', path: `admins/${u.uid}` }),
            );
            await firebaseSignOut(auth);
          } else {
            toast({
              title: 'Authentication Error',
              description: 'Could not verify your admin permissions.',
              variant: 'destructive',
            });
          }
        }
      }

      setIsAdmin(userIsAdmin);

      // Auth pages
      const isAppLogin =
        pathname === '/app/login' || pathname === '/app/register' || pathname === '/app/forgot-password';
      const isAdminLogin = pathname === '/admin/login' || pathname === '/admin/forgot-password';

      // Public pages
      const isPublicRoute =
        publicRoutes.includes(pathname) ||
        servicesRegex.test(pathname) ||
        solutionsRegex.test(pathname) ||
        venuesRegex.test(pathname) ||
        uploadRegex.test(pathname);

      // 🔁 Redirect logic
      if (u && userIsAdmin) {
        // Admin user is logged in
        if (!pathname.startsWith('/admin') || isAdminLogin) {
          router.replace('/admin/home');
        }
      } else if (u) {
        // Non-admin (host) user is logged in
        if (!pathname.startsWith('/app') || isAppLogin) {
          router.replace('/app/home');
        }
      } else {
        // No user is logged in
        if (pathname.startsWith('/admin') && !isAdminLogin) {
          router.replace('/admin/login');
        } else if (pathname.startsWith('/app') && !isAppLogin) {
          router.replace('/app/login');
        }
        // For all other cases (e.g., public routes), do nothing and allow access.
      }

      setLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // keep deps minimal to avoid loops

  const signOut = async () => {
    const isAdminPath = pathname.startsWith('/admin');
    await firebaseSignOut(auth);
    setUser(null);
    setIsAdmin(false);
    router.push(isAdminPath ? '/admin/login' : '/app/login');
  };

  const updateProfile = async (profileData: { displayName?: string | null; photoURL?: string | null }) => {
    if (auth.currentUser) {
      await firebaseUpdateProfile(auth.currentUser, profileData);
      // Refresh local state from the actual currentUser instance
      setUser(auth.currentUser);
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
