
'use client';

import React, { ReactNode } from 'react';
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

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/', '/contact', '/gallery'];
const servicesRegex = /^\/services(\/.*)?$/;
const uploadRegex = /^\/upload(\/.*)?$/;


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    // --- TEMPORARY DEVELOPMENT LOGIC ---
    // This simulates a logged-in user to bypass authentication during development.
    // It makes the system assume a user is logged in based on the current URL.
    setLoading(true);
    const isAppRoute = pathname.startsWith('/app');
    const isAdminRoute = pathname.startsWith('/admin');

    if (isAdminRoute) {
        // If we are in an admin route, simulate an admin user being logged in.
        setUser({ email: ADMIN_EMAIL, displayName: 'Admin' } as User);
        setIsAdmin(true);
    } else if (isAppRoute) {
        // If we are in a client app route, simulate a client/host user being logged in.
        setUser({ email: 'client@urevent360.com', displayName: 'Host' } as User);
        setIsAdmin(false);
    } else {
        // For public pages, no user is simulated.
        setUser(null);
        setIsAdmin(false);
    }
    setLoading(false);

    // The original Firebase auth logic is commented out below.
    // To re-enable real authentication, remove the temporary logic above
    // and uncomment the `onAuthStateChanged` listener.

    /*
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
    */
  }, [router, pathname]);

  const signOut = async () => {
    // In dev mode, just clear the user and redirect to the appropriate login page.
    setUser(null);
    setIsAdmin(false);

    // The original Firebase sign-out call is commented for development.
    // await firebaseSignOut(auth); 
    
    if (pathname.startsWith('/admin')) {
      router.push('/admin/login');
    } else if (pathname.startsWith('/app')) {
      router.push('/app/login');
    } else {
      router.push('/');
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signOut }}>
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
