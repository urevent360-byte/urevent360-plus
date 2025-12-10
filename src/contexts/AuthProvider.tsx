'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import {
  onAuthStateChanged,
  User,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/authClient';

type Role = 'admin' | 'host' | 'unknown';

type AuthCtx = {
  user: User | null;
  loading: boolean;
  roleLoaded: boolean;
  isAdmin: boolean;
  role: Role;
  signOut: () => Promise<void>;
  updateProfile: (profile: { displayName?: string; photoURL?: string }) => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

// ---- helpers de cookie de rol ----

async function clearRoleCookie() {
  try {
    await fetch('/api/session/clear-role', { method: 'POST' });
  } catch (e) {
    console.error('Error clearing role cookie', e);
  }
}

function getRoleFromCookie(): Role {
  if (typeof window === 'undefined') return 'unknown';

  const cookie = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((row) => row.startsWith('role='));

  if (!cookie) return 'unknown';

  const value = cookie.split('=')[1];
  if (value === 'admin') return 'admin';
  if (value === 'host') return 'host';
  return 'unknown';
}

// ---- AuthProvider real (con Firebase) ----

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1) Escuchar cambios de sesión en Firebase
  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      // si se cerró sesión, limpia cookie de rol
      if (!u) {
        await clearRoleCookie();
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 2) Logout
  const signOut = useCallback(async () => {
    try {
      const auth = getFirebaseAuth();
      await auth.signOut();
      await clearRoleCookie();
      // El propio middleware + layouts se encargarán de redirigir
    } catch (e) {
      console.error('Error on signOut', e);
    }
  }, []);

  // 3) Actualizar perfil
  const updateProfile = useCallback(
    async (profile: { displayName?: string; photoURL?: string }) => {
      const auth = getFirebaseAuth();
      if (auth.currentUser) {
        await firebaseUpdateProfile(auth.currentUser, profile);
        // Forzar re-render copiando el user
        setUser({ ...auth.currentUser });
      }
    },
    []
  );

  // 4) Rol a partir de la cookie (solo tiene sentido si hay user)
  const role: Role = user ? getRoleFromCookie() : 'unknown';
  const isAdmin = role === 'admin';

  // 5) Valor expuesto al resto de la app
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
