
'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import {
  getFirebaseAuth,
  onAuthStateChanged,
  firebaseUpdateProfile,
  type User,
  type Auth,
} from '@/lib/firebase/authClient';

type Role = 'admin' | 'host' | 'unknown';

type AuthCtx = {
  user: User | null;
  loading: boolean;
  roleLoaded: boolean;
  role: Role;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  updateProfile: (profile: { displayName?: string; photoURL?: string }) => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

// ---- role cookie helpers ----

async function clearRoleCookie() {
  try {
    await fetch('/api/session/clear-role', { method: 'POST', credentials: 'include' });
  } catch (e) {
    console.error('Error clearing role cookie', e);
  }
}

function readRoleCookie(): Role {
  if (typeof window === 'undefined') return 'unknown';

  const cookie = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((row) => row.startsWith('role='));

  if (!cookie) return 'unknown';

  const value = decodeURIComponent(cookie.split('=').slice(1).join('='));
  if (value === 'admin') return 'admin';
  if (value === 'host') return 'host';
  return 'unknown';
}

// ---- AuthProvider ----

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<Auth | null>(null);

  // Firebase user state
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Role state (independiente de user)
  const [role, setRole] = useState<Role>('unknown');
  const [roleLoaded, setRoleLoaded] = useState(false);

  // 1) Init auth (client-only)
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const authInstance = await getFirebaseAuth();
        if (alive) setAuth(authInstance);
      } catch (e) {
        console.error('Failed to init Firebase Auth', e);
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // 2) Load role cookie immediately on mount (no depende de Firebase)
  useEffect(() => {
    setRole(readRoleCookie());
    setRoleLoaded(true);

    // Optional: keep role in sync if another tab updates cookies
    const onFocus = () => {
      setRole(readRoleCookie());
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // 3) Listen auth changes
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);

      // IMPORTANT:
      // NO borres role cookie aquí. Firebase puede emitir null temporalmente al restaurar sesión.
      // El rol se controla por middleware/cookie + signOut explícito.
    });

    return () => unsubscribe();
  }, [auth]);

  // 4) Logout (ONLY here we clear role)
  const signOut = useCallback(async () => {
    if (!auth) return;

    try {
      await auth.signOut();
    } catch (e) {
      console.error('Error on Firebase signOut', e);
    } finally {
      await clearRoleCookie();
      setRole('unknown');
      setUser(null);
    }
  }, [auth]);

  // 5) Update profile
  const updateProfile = useCallback(
    async (profile: { displayName?: string; photoURL?: string }) => {
      if (auth?.currentUser) {
        await firebaseUpdateProfile(auth.currentUser, profile);
        setUser({ ...auth.currentUser });
      }
    },
    [auth]
  );

  const isAdmin = role === 'admin';

  const value = useMemo(
    () => ({
      user,
      loading,
      roleLoaded,
      role,
      isAdmin,
      signOut,
      updateProfile,
    }),
    [user, loading, roleLoaded, role, isAdmin, signOut, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}