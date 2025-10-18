
'use client';

import React, { ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, updateProfile as firebaseUpdateProfile } from 'firebase/auth';
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
      if (user) {
        try {
          const adminDocRef = doc(db, 'admins', user.uid);
          const adminDoc = await getDoc(adminDocRef);

          if (adminDoc.exists() && adminDoc.data().active === true && adminDoc.data().role) {
            userIsAdmin = true;
          }
        } catch (error: any) {
            if (error.code === 'permission-denied') {
                errorEmitter.emit('permission-error', new FirestorePermissionError({
                    operation: 'get',
                    path: `admins/${user.uid}`,
                }));
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

      const isAppLogin = pathname === '/app/login' || pathname === '/app/register' || pathname === '/app/forgot-password';
      const isAdminLogin = pathname === '/admin/login' || pathname === '/admin/forgot-password';

      const isPublicRoute = publicRoutes.includes(pathname) || 
                            servicesRegex.test(pathname) || 
                            solutionsRegex.test(pathname) ||
                            venuesRegex.test(pathname) ||
                            uploadRegex.test(pathname);

      if (user) {
        if (userIsAdmin) {
          // User is an admin
          if (pathname.startsWith('/admin') && !isAdminLogin) {
             // Already in admin section, do nothing.
          } else {
             // If they are on any other page (including login pages), redirect to admin home.
             router.replace('/admin/home');
          }
        } else { // Regular host user
           if (pathname.startsWith('/app') && !isAppLogin) {
             // Already in app section, do nothing.
           } else if (isAppLogin) {
             // If on a host login page, redirect to host home.
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
    const isAdminPath = pathname.startsWith('/admin');
    await firebaseSignOut(auth); 
    setUser(null);
    setIsAdmin(false); 
    
    // Redirect based on the portal they were in.
    if (isAdminPath) {
      router.push('/admin/login');
    } else {
      router.push('/app/login');
    }
  };
  
  const updateProfile = async (profileData: { displayName?: string; photoURL?: string; }) => {
      if (auth.currentUser) {
          await firebaseUpdateProfile(auth.currentUser, profileData);
          // Refresh user state to reflect changes
          setUser({ ...auth.currentUser });
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
