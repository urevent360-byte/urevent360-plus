'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { usePathname, useRouter } from 'next/navigation';

// For this example, we'll hardcode the admin email. In a real-world scenario,
// this would be managed in a database (e.g., Firestore) with user roles.
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
      setUser(user);
      const userIsAdmin = user?.email === ADMIN_EMAIL;
      setIsAdmin(userIsAdmin);
      setLoading(false);

      if (user) {
        if (userIsAdmin) {
          // If the user is an admin and not in the admin section, redirect them.
          if (!pathname.startsWith('/admin')) {
            router.push('/admin/dashboard');
          }
        } else {
          // If the user is a client and not in the client dashboard, redirect them.
          if (!pathname.startsWith('/dashboard') && !['/', '/services', '/gallery', '/contact', '/register', '/login'].some(p => pathname.startsWith(p)) ) {
            router.push('/dashboard');
          }
        }
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signOut }}>
      {children}
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
