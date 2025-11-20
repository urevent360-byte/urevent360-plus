'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { onAuthStateChanged, User, updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/authClient';

type Role = 'admin' | 'host' | 'unknown';

type AuthCtx = {
  user: User | null;
  loading: boolean;
  roleLoaded: boolean;
  isAdmin: boolean;
  role: Role;
  signOut: () => Promise<void>;
  updateProfile?: (profile: { displayName?: string; photoURL?: string }) => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

// Páginas de auth permitidas sin sesión
const adminAuthPages = ['/admin/login', '/admin/forgot-password'];
const appAuthPages = ['/app/login', '/app/register', '/app/forgot-password'];

function isAdminArea(path: string) {
  return path === '/admin' || path.startsWith('/admin/');
}

function isAppArea(path: string) {
  return path === '/app' || path.startsWith('/app/');
}

async function clearRoleCookie() {
  await fetch('/api/session/clear-role', {
    method: 'POST',
  });
}

function getRoleFromCookie(): Role {
  if (typeof window === 'undefined') return 'unknown';
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('role='))
    ?.split('=')[1];

  if (cookie === 'admin') return 'admin';
  if (cookie === 'host') return 'host';
  return 'unknown';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname() ?? '/';

  // 1) Escuchar cambios de sesión Firebase
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (!u) {
        // User logged out → limpiar cookie de rol
        await clearRoleCookie();
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 2) Función de logout
  const signOut = useCallback(async () => {
    const inAdmin = isAdminArea(pathname);
    await auth.signOut();
    // onAuthStateChanged se encargará de limpiar la cookie
    router.push(inAdmin ? '/admin/login' : '/app/login');
  }, [pathname, router]);

  // 3) Actualizar perfil
  const updateProfile = useCallback(
    async (profile: { displayName?: string; photoURL?: string }) => {
      if (auth.currentUser) {
        await firebaseUpdateProfile(auth.currentUser, profile);
        setUser(auth.currentUser ? { ...auth.currentUser } : null);
      }
    },
    []
  );

  // 4) Roles (a partir de la cookie)
  const role: Role = user ? getRoleFromCookie() : 'unknown';
  const isAdmin = role === 'admin';

  // 5) Lógica de redirección según sesión + rol + ruta actual
  useEffect(() => {
    if (loading) return;

    // Usuario NO autenticado → proteger /admin y /app
    if (!user) {
      if (isAdminArea(pathname) && !adminAuthPages.includes(pathname)) {
        router.replace('/admin/login');
        return;
      }
      if (isAppArea(pathname) && !appAuthPages.includes(pathname)) {
        router.replace('/app/login');
        return;
      }
      return;
    }

    // Usuario autenticado
    if (role === 'admin') {
      // Admin no debería estar en /app*, ni en /admin login/root
      if (isAppArea(pathname) || pathname === '/admin' || adminAuthPages.includes(pathname)) {
        router.replace('/admin/dashboard');
        return;
      }
    } else if (role === 'host') {
      // Host no debería estar en /admin*, ni en /app root/login
      if (isAdminArea(pathname) || pathname === '/app' || appAuthPages.includes(pathname)) {
        router.replace('/app/dashboard');
        return;
      }
    }
  }, [loading, user, role, pathname, router]);

  const value = useMemo(
    () => ({
      user,
      loading,
      roleLoaded: !loading,
      isAdmin,
      role,
      signOut,
      updateProfile,
    }),
    [user, loading, isAdmin, role, signOut, updateProfile]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
}
