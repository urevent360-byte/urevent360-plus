'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '@/lib/firebase/authClient';
import { db } from '@/lib/firebase/client';

type AuthCtx = {
  user: User | null;
  loading: boolean;        // incluye carga de sesión + rol
  isAdmin: boolean;
  role: 'admin' | 'host' | 'unknown';
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'host' | 'unknown'>('unknown');
  const [loading, setLoading] = useState(true); // <- permanece true hasta rol resuelto

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setRole('unknown');
        setLoading(false);
        return;
      }

      // 1) Lee admins/{uid}
      try {
        const snap = await getDoc(doc(db, 'admins', u.uid));
        if (snap.exists() && snap.data()?.active) {
          setRole('admin');
        } else {
          setRole('host');
        }
      } catch {
        setRole('host');
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const isAdmin = role === 'admin';

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin,
      role,
      signOut: () => import('firebase/auth').then(({ signOut }) => signOut(auth)),
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
