
'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
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
        return;
      }

      // 2) Fallback to Firestore: admins/{uid}
      const db = getFirestore(app);
      const ref = doc(db, 'admins', user.uid);
      try {
        const snap = await getDoc(ref);
        if (!cancelled) {
          const isActiveAdmin = snap.exists() && (snap.data() as any)?.active !== false;
          setIsAdmin(isActiveAdmin);
        }
      } catch (error) {
          console.error("Error checking admin status in Firestore:", error);
          if (!cancelled) {
              setIsAdmin(false);
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

  const value = useMemo(
    () => ({
      user,
      loading,
      roleLoaded: !roleLoading,
      isAdmin,
      role,
      signOut: () => import('firebase/auth').then(({ signOut }) => signOut(auth)),
      updateProfile,
    }),
    [user, loading, roleLoading, isAdmin, role]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
}
