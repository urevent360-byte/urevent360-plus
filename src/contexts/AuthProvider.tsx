
'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { onAuthStateChanged, User, updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { auth } from '@/lib/firebase/authClient';
import { app } from '@/lib/firebase/client'; // Import app to initialize db

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

async function setRoleCookie(role: Role) {
  if (role === 'unknown') return;
  await fetch('/api/session/set-role', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
}

async function clearRoleCookie() {
    await fetch('/api/session/clear-role', {
        method: 'POST',
    });
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
          // User logged out, clear the cookie
          await clearRoleCookie();
      }
      setAuthLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setRoleLoading(true);

    async function checkAdmin() {
      if (!user) {
        if (!cancelled) {
          setIsAdmin(false);
          setRoleLoading(false);
        }
        return;
      }

      // 1) Prefer the custom claim
      const tok = await user.getIdTokenResult(true);
      if (!cancelled && tok.claims?.admin === true) {
        setIsAdmin(true);
        setRoleLoading(false);
        await setRoleCookie('admin');
        return;
      }

      // 2) Fallback to Firestore: admins/{uid}
      const db = getFirestore(app);
      const ref = doc(db, 'admins', user.uid);
      try {
        const snap = await getDoc(ref);
        const isActiveAdmin = snap.exists() && (snap.data() as any)?.active !== false;
        if (!cancelled) {
          setIsAdmin(isActiveAdmin);
          await setRoleCookie(isActiveAdmin ? 'admin' : 'host');
        }
      } catch (error) {
          console.error("Error checking admin status in Firestore:", error);
          if (!cancelled) {
              setIsAdmin(false);
              await setRoleCookie('host');
          }
      } finally {
          if (!cancelled) {
              setRoleLoading(false);
          }
      }
    }

    checkAdmin();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const role: Role = isAdmin ? 'admin' : (user ? 'host' : 'unknown');
  const loading = authLoading || roleLoading;

  const updateProfile = async (profile: { displayName?: string; photoURL?: string }) => {
    if (auth.currentUser) {
      await firebaseUpdateProfile(auth.currentUser, profile);
      // Create a new user object to trigger a re-render
      setUser(auth.currentUser ? { ...auth.currentUser } : null);
    }
  };
  
  const signOut = useCallback(async () => {
    await auth.signOut();
    // The onAuthStateChanged listener will handle clearing the cookie
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      roleLoaded: !roleLoading,
      isAdmin,
      role,
      signOut,
      updateProfile,
    }),
    [user, loading, roleLoading, isAdmin, role, signOut]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
}
