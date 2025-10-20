'use client';

import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';

import { auth } from '@/lib/firebase/authClient';
import { db } from '@/lib/firebase/client';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => void;
  updateProfile?: (profileData: { displayName?: string | null; photoURL?: string | null }) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Rutas públicas (acceso sin login)
const publicRoutes = new Set<string>([
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
]);

// Páginas de auth permitidas sin sesión
const adminAuthPages = new Set<string>(['/admin/login', '/admin/forgot-password']);
const appAuthPages   = new Set<string>(['/app/login', '/app/register', '/app/forgot-password']);

// Helpers
const isAdminArea = (p: string) => p === '/admin' || p.startsWith('/admin/');
const isAppArea   = (p: string) => p === '/app'   || p.startsWith('/app/');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname() ?? '/';

  // 1) Suscripción de Auth y chequeo de rol admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setLoading(true);
      setUser(u);

      let userIsAdmin = false;

      if (u) {
        try {
          const adminDocSnap = await getDoc(doc(db, 'admins', u.uid));
          if (adminDocSnap.exists()) {
            const data = adminDocSnap.data() as { role?: string; active?: boolean };
            const role = (data?.role ?? '').toString().toLowerCase();
            const active = data?.active; // puede ser undefined

            // Si NO hay "active", lo tratamos como permitido (backward compatible)
            const allowed = new Set(['admin', 'owner', 'super admin']);
            userIsAdmin = allowed.has(role) && (active === undefined || active === true);
          }
        } catch {
          // Si falla la lectura (reglas), asumimos "no admin" para no romper navegación.
          userIsAdmin = false;
        }
      }

      setIsAdmin(userIsAdmin);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2) Redirecciones simples y predecibles
  useEffect(() => {
    if (loading) return;

    // Usuario no autenticado → proteger zonas /admin/* y /app/* (excepto páginas de auth)
    if (!user) {
      if (isAdminArea(pathname) && !adminAuthPages.has(pathname)) {
        router.replace('/admin/login');
        return;
      }
      if (isAppArea(pathname) && !appAuthPages.has(pathname)) {
        router.replace('/app/login');
        return;
      }
      // En públicas o páginas de auth permitidas → no tocar
      return;
    }

    // Usuario autenticado admin
    if (isAdmin) {
      // Si cae en /app/*, lo mandamos a admin dashboard
      if (isAppArea(pathname)) {
        router.replace('/admin/home');
        return;
      }
      // Si está en /admin root o en páginas de auth de admin, también a dashboard
      if (pathname === '/admin' || adminAuthPages.has(pathname)) {
        router.replace('/admin/dashboard');
        return;
      }
      // Nada más que hacer
      return;
    }

    // Usuario autenticado host (NO admin)
    // Si cae en /admin/*, lo mandamos a app home
    if (isAdminArea(pathname)) {
      router.replace('/app/home');
      return;
    }
    // Si está en /app root o en páginas de auth de app, lo llevamos a home
    if (pathname === '/app' || appAuthPages.has(pathname)) {
      router.replace('/app/home');
      return;
    }
  }, [loading, user, isAdmin, pathname, router]);

  const signOut = async () => {
    const inAdmin = isAdminArea(pathname);
    await firebaseSignOut(auth);
    // onAuthStateChanged limpiará el estado y el efecto de arriba redirigirá
    router.push(inAdmin ? '/admin/login' : '/app/login');
  };

  const updateProfile = async (profileData: { displayName?: string | null; photoURL?: string | null }) => {
    if (auth.currentUser) {
      await firebaseUpdateProfile(auth.currentUser, profileData);
      setUser({ ...auth.currentUser }); // forza re-render
    }
  };

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAdmin,
    loading,
    signOut,
    updateProfile,
  }), [user, isAdmin, loading]);

  return (
    <AuthContext.Provider value={value}>
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
