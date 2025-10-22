'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, User, updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '@/lib/firebase/authClient';
import { db } from '@/lib/firebase/client';

type AuthCtx = {
  user: User | null;
  loading: boolean;        // incluye carga de sesión + rol
  isAdmin: boolean;
  role: 'admin' | 'host' | 'unknown';
  signOut: () => Promise<void>;
  updateProfile?: (profile: { displayName?: string, photoURL?: string }) => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'host' | 'unknown'>('unknown');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setLoading(true); // Ensure loading is true while we check roles.
      setUser(u);

      if (!u) {
        setRole('unknown');
        setLoading(false);
        return;
      }

      try {
        // Check for admin role in Firestore
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
        // This is the crucial part: setLoading(false) only after the async check is complete.
        setLoading(false);
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

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin,
      role,
      signOut: () => import('firebase/auth').then(({ signOut }) => signOut(auth)),
      updateProfile,
    }),
    [user, loading, isAdmin, role]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
}
