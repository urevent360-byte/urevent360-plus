'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { onAuthStateChanged, User, updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase/authClient';
import { useRouter } from 'next/navigation';

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

async function clearRoleCookie() {
    await fetch('/api/session/clear-role', {
        method: 'POST',
    });
}

function getRoleFromCookie(): Role {
    if (typeof window === 'undefined') return 'unknown';
    const roleCookie = document.cookie.split('; ').find(row => row.startsWith('role='))?.split('=')[1];
    if (roleCookie === 'admin') return 'admin';
    if (roleCookie === 'host') return 'host';
    return 'unknown';
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
          // User logged out, clear the cookie
          await clearRoleCookie();
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);
  
  const signOut = useCallback(async () => {
    await auth.signOut();
    // The onAuthStateChanged listener handles cookie clearing.
    // Redirect to home page after sign out.
    router.push('/');
  }, [router]);

  const updateProfile = async (profile: { displayName?: string; photoURL?: string }) => {
    if (auth.currentUser) {
      await firebaseUpdateProfile(auth.currentUser, profile);
      // Create a new user object to trigger a re-render
      setUser(auth.currentUser ? { ...auth.currentUser } : null);
    }
  };

  // This logic is simplified. The middleware is the source of truth for routing.
  // This just provides context to the UI.
  const role = user ? getRoleFromCookie() : 'unknown';
  const isAdmin = role === 'admin';

  const value = useMemo(
    () => ({
      user,
      loading,
      roleLoaded: !loading, // Role is considered "loaded" when auth state is resolved.
      isAdmin,
      role,
      signOut,
      updateProfile,
    }),
    [user, loading, isAdmin, role, signOut]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
}
