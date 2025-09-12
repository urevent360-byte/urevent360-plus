'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { usePathname, useRouter } from 'next/navigation';

// For this prototype, we'll use a hardcoded email to identify the admin.
// In a production app, this would be managed via Firebase Custom Claims.
const ADMIN_EMAIL = 'admin@urevent360.com';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      setUser(user);
      const userIsAdmin = user?.email === ADMIN_EMAIL;
      setIsAdmin(userIsAdmin);
      setLoading(false);

      const isAuthPage = pathname.startsWith('/app/login') || pathname.startsWith('/app/register') || pathname.startsWith('/admin/login');

      if (user) {
        if (userIsAdmin) {
          // If admin is logged in, ensure they are in the admin portal.
          // Redirect from any other location to the admin home.
          if (!pathname.startsWith('/admin')) {
            router.push('/admin/home');
          }
        } else {
          // If a non-admin (host) is logged in, ensure they are in the app portal.
          // Redirect from any other location (including /admin) to the app home.
          if (!pathname.startsWith('/app')) {
             router.push('/app/home');
          }
        }
      } else {
        // User is not logged in. Middleware will handle unauthorized access
        // to private routes.
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    // Redirect to the main public page after sign-out.
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signOut }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
