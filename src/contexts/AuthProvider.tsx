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
    .find((row) => row.startsWith('role_ui='));

  if (!cookie) return 'unknown';

  const value = decodeURIComponent(cookie.split('=').slice(1).join('='));
  if (value === 'admin') return 'admin';
  if (value === 'host') return 'host';
  return 'unknown';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<Auth | null>(null);

  // Firebase user
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Role cookie (independiente del user)
  const [role, setRole] = useState<Role>('unknown');
  const [roleLoaded, setRoleLoaded] = useState(false);

  // Init auth
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

  // Load role cookie ASAP
  useEffect(() => {
    setRole(readRoleCookie());
    setRoleLoaded(true);

    const onFocus = () => setRole(readRoleCookie());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Firebase auth listener (NO borra cookies aquí)
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // Logout: aquí SÍ limpiamos cookie
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
    () => ({ user, loading, roleLoaded, role, isAdmin, signOut, updateProfile }),
    [user, loading, roleLoaded, role, isAdmin, signOut, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}