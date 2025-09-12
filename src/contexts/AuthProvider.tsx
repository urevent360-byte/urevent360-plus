
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

const publicRoutes = ['/', '/contact', '/gallery'];
const servicesRegex = /^\/services(\/.*)?$/;
const uploadRegex = /^\/upload(\/.*)?$/;


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

      const isAppLogin = pathname === '/app/login' || pathname === '/app/register' || pathname === '/app/forgot-password';
      const isAdminLogin = pathname === '/admin/login' || pathname === '/admin/forgot-password';

      const isPublicRoute = publicRoutes.includes(pathname) || servicesRegex.test(pathname) || uploadRegex.test(pathname);

      if (user) {
        if (userIsAdmin) {
          // If admin is logged in, and they are not in the admin section, redirect them.
          if (!pathname.startsWith('/admin')) {
            router.push('/admin/home');
          }
        } else {
          // If a non-admin client is logged in, and they are not in the app section, redirect them.
          if (!pathname.startsWith('/app')) {
            router.push('/app/home');
          }
        }
      } else {
        // User is not logged in.
        // If they try to access a protected route, redirect to the appropriate login page.
        if (pathname.startsWith('/admin') && !isAdminLogin) {
          router.push('/admin/login');
        } else if (pathname.startsWith('/app') && !isAppLogin) {
          router.push('/app/login');
        }
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/');
  };

  const isAuthRoute = pathname.startsWith('/admin') || pathname.startsWith('/app');

  // If we are loading and it's a protected route, show nothing to prevent flicker.
  // Public routes can render immediately.
  if (loading && isAuthRoute) {
    return null;
  }
  
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
