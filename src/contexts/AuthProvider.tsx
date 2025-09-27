
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
  updateProfile?: (profileData: { displayName?: string; photoURL?: string; }) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/', '/contact', '/gallery', '/plan', '/orlando-event-planning', '/corporate-event-production-orlando', '/wedding-entertainment-orlando', '/quinceanera-entertainment-orlando', '/sweet-16-entertainment-orlando', '/birthday-party-entertainment-orlando', '/baby-shower-entertainment-orlando', '/prom-entertainment-orlando'];
const servicesRegex = /^\/services(\/.*)?$/;
const solutionsRegex = /^\/solutions(\/.*)?$/;
const venuesRegex = /^\/venues(\/.*)?$/;
const uploadRegex = /^\/upload(\/.*)?$/;


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      setUser(user);
      const userIsAdmin = user?.email === ADMIN_EMAIL;
      setIsAdmin(userIsAdmin);
      setLoading(false);

      const isAppLogin = pathname === '/app/login' || pathname === '/app/register' || pathname === '/app/forgot-password';
      const isAdminLogin = pathname === '/admin/login' || pathname === '/admin/forgot-password';

      const isPublicRoute = publicRoutes.includes(pathname) || 
                            servicesRegex.test(pathname) || 
                            solutionsRegex.test(pathname) ||
                            venuesRegex.test(pathname) ||
                            uploadRegex.test(pathname);

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
    
    if (pathname.startsWith('/admin')) {
      router.push('/admin/login');
    } else if (pathname.startsWith('/app')) {
      router.push('/app/login');
    } else {
      router.push('/');
    }
  };
  
  const updateProfile = (profileData: { displayName?: string; photoURL?: string; }) => {
      setUser(currentUser => {
          if (!currentUser) return null;
          return {
              ...currentUser,
              ...profileData,
          } as User;
      });
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
