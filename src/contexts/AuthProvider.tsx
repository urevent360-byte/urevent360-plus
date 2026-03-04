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

// ---- cookie helpers ----
// IMPORTANT: UI must read role_ui (NOT role) because role is HttpOnly.
function readCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  const match = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.split('=').slice(1).join('='));
}

function readRoleUI(): Role {
  const value = readCookie('role_ui');
  if (value === 'admin') return 'admin';
  if (value === 'host') return 'host';
  return 'unknown';
}

async function clearRoleCookie() {
  try {
    await fetch('/api/session/clear-role', { method: 'POST', credentials: 'include' });
  } catch (e) {
    console.error('Error clearing role cookie', e);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<Auth | null>(null);

  // Firebase user
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Role for UI (from role_ui cookie)
  const [role, setRole] = useState<Role>('unknown');
  const [roleLoaded, setRoleLoaded] = useState(false);

  // 1) Init Firebase Auth
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

  // 2) Load role_ui immediately (independent of Firebase)
  useEffect(() => {
    const sync = () => setRole(readRoleUI());
    sync();
    setRoleLoaded(true);

    // Keep in sync when tab refocuses
    window.addEventListener('focus', sync);
    return () => window.removeEventListener('focus', sync);
  }, []);

  // 3) Listen Firebase auth changes (DO NOT clear cookies here!)
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      // DO NOT clear role cookie here.
      // Firebase can emit null briefly while restoring session.
    });

    return () => unsubscribe();
  }, [auth]);

  // 4) Logout (ONLY here we clear role cookies)
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
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}