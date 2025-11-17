'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { onAuthStateChanged, User, updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { auth } from '@/lib/firebase/authClient';
import { app } from '@/lib/firebase/client';
import { usePathname, useRouter } from 'next/navigation';

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


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
          // User logged out, clear the cookie
          await clearRoleCookie();
          setIsAdmin(false);
      }
      setAuthLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    let cancelled = false;
    
    async function checkAdminAndRedirect() {
      setRoleLoading(true);
      if (!user) {
        setIsAdmin(false);
        setRoleLoading(false);
        return;
      }

      // Check for role cookie first as a quick check
      // Note: The definitive check is done via token or Firestore below
      const roleCookie = document.cookie.split('; ').find(row => row.startsWith('role='))?.split('=')[1];
      
      // 1) Prefer the custom claim for definitive role check
      try {
        const tokenResult = await user.getIdTokenResult(true);
        if (tokenResult.claims?.admin === true) {
          if (!cancelled) {
            setIsAdmin(true);
            setRoleLoading(false);
            if (pathname?.startsWith('/app')) router.replace('/admin/dashboard');
          }
          return;
        }
      } catch (e) {
        console.error("Error getting ID token:", e);
      }

      // 2) Fallback to Firestore: admins/{uid}
      const db = getFirestore(app);
      const ref = doc(db, 'admins', user.uid);
      try {
        const snap = await getDoc(ref);
        const isActiveAdmin = snap.exists() && (snap.data() as any)?.active !== false;
        if (!cancelled) {
          setIsAdmin(isActiveAdmin);
           if (isActiveAdmin && pathname?.startsWith('/app')) {
            router.replace('/admin/dashboard');
          } else if (!isActiveAdmin && pathname?.startsWith('/admin')) {
            router.replace('/app/home');
          }
        }
      } catch (error) {
          console.error("Error checking admin status in Firestore:", error);
          if (!cancelled) {
              setIsAdmin(false);
              if (pathname?.startsWith('/admin')) router.replace('/app/home');
          }
      } finally {
          if (!cancelled) {
              setRoleLoading(false);
          }
      }
    }

    checkAdminAndRedirect();
    return () => {
      cancelled = true;
    };
  }, [user, pathname, router]);

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
    // The onAuthStateChanged listener will handle cookie clearing
    // Redirect to home page after sign out to avoid being stuck on a protected route
    router.push('/');
  }, [router]);

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
