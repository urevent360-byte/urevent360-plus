'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, User, updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '@/lib/firebase/authClient';
import { db } from '@/lib/firebase/client';

type Role = 'admin' | 'host' | 'unknown';

type AuthCtx = {
  user: User | null;
  loading: boolean;
  roleLoaded: boolean;
  isAdmin: boolean;
  role: Role;
  signOut: () => Promise<void>;
  updateProfile?: (profile: { displayName?: string, photoURL?: string }) => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>('unknown');
  const [authLoading, setAuthLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthLoading(false);

      if (!u) {
        setRole('unknown');
        setRoleLoading(false);
        return;
      }

      setRoleLoading(true);
      try {
        const adminDocRef = doc(db, 'admins', u.uid);
        const adminDocSnap = await getDoc(adminDocRef);

        if (adminDocSnap.exists() && adminDocSnap.data()?.active) {
          setRole('admin');
        } else {
          setRole('host');
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setRole('host'); // Default to 'host' on error
      } finally {
        setRoleLoading(false);
      }
    });

    return () => unsub();
  }, []);
  
  const updateProfile = async (profile: { displayName?: string, photoURL?: string }) => {
    if (auth.currentUser) {
        await firebaseUpdateProfile(auth.currentUser, profile);
        // Refresh user state by re-setting it
        setUser(auth.currentUser ? { ...auth.currentUser } : null);
    }
  };

  const isAdmin = role === 'admin';
  const loading = authLoading || roleLoading;

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
