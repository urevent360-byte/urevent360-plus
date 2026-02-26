'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
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
  isAdmin: boolean;
  role: Role;
  signOut: () => Promise<void>;
  updateProfile: (profile: { displayName?: string; photoURL?: string }) => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

// -------------------------------
// Cookie helpers
// -------------------------------

async function clearRoleCookie() {
  try {
    await fetch('/api/session/clear-role', {
      method: 'POST',
      credentials: 'include',
    });
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

// -------------------------------
// AuthProvider
// -------------------------------

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);

  // Firebase can emit null briefly while restoring session.
  // We DO NOT clear role cookie unless we had a user before.
  const hadUserRef = useRef(false);

  // 1️⃣ Initialize Firebase Auth
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

  // 2️⃣ Listen to auth changes
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        hadUserRef.current = true;
      } else if (hadUserRef.current) {
        // Only clear cookie after real logout
        await clearRoleCookie();
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // 3️⃣ Logout
  const signOut = useCallback(async () => {
    if (!auth) return;

    try {
      await auth.signOut();
      await clearRoleCookie();
    } catch (e) {
      console.error('Error during signOut', e);
    }
  }, [auth]);

  // 4️⃣ Update profile
  const updateProfile = useCallback(
    async (profile: { displayName?: string; photoURL?: string }) => {
      if (auth?.currentUser) {
        await firebaseUpdateProfile(auth.currentUser, profile);
        setUser({ ...auth.currentUser });
      }
    },
    [auth]
  );

  // 5️⃣ ROLE FIX (CRITICAL FIX)
  // 🔥 IMPORTANT: DO NOT depend on `user` here.
  // Cookie exists independently of Firebase's brief null state.
  const role: Role = getRoleFromCookie();
  const isAdmin = role === 'admin';

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}