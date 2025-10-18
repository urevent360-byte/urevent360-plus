
'use client';

import React, { ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
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
  const { toast } = useToast();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setUser(user);
      
      let userIsAdmin = false;
      // Only check for admin status if the user is logged in AND trying to access an admin route
      if (user && pathname.startsWith('/admin')) {
        try {
          const adminDocRef = doc(db, 'admins', user.uid);
          const adminDoc = await getDoc(adminDocRef);

          if (adminDoc.exists() && adminDoc.data().active === true && adminDoc.data().role) {
            userIsAdmin = true;
          } else {
             toast({
                title: 'Access Denied',
                description: 'You do not have permission to access the admin portal.',
                variant: 'destructive',
            });
          }
        } catch (error) {
            console.error("Error verifying admin status:", error);
            toast({
                title: 'Authentication Error',
                description: 'Could not verify your admin permissions.',
                variant: 'destructive',
            });
        }
      }
      setIsAdmin(userIsAdmin);

      const isAppLogin = pathname === '/app/login' || pathname === '/app/register' || pathname === '/app/forgot-password';
      const isAdminLogin = pathname === '/admin/login' || pathname === '/admin/forgot-password';

      const isPublicRoute = publicRoutes.includes(pathname) || 
                            servicesRegex.test(pathname) || 
                            solutionsRegex.test(pathname) ||
                            venuesRegex.test(pathname) ||
                            uploadRegex.test(pathname);

      if (user) {
        if (userIsAdmin) {
          if (!pathname.startsWith('/admin')) {
            router.replace('/admin/home');
          }
        } else { // Regular host user
           if (pathname.startsWith('/admin')) {
             // If a regular user tries to access an admin page, deny access and redirect
             toast({ title: 'Access Denied', variant: 'destructive' });
             router.replace('/app/home');
           } else if (!pathname.startsWith('/app')) {
             router.replace('/app/home');
           }
        }
      } else { // No user logged in
        if (pathname.startsWith('/admin') && !isAdminLogin) {
          router.replace('/admin/login');
        } else if (pathname.startsWith('/app') && !isAppLogin) {
          router.replace('/app/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname, toast]);

  const signOut = async () => {
    await firebaseSignOut(auth); 
    setIsAdmin(false); // Reset admin state on logout
    
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
