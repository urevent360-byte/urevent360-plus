// Safe to import on server/client, but Auth instance is created ONLY on client.
import {
  getAuth,
  type Auth,
  onAuthStateChanged,
  type User,
  updateProfile as firebaseUpdateProfile,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  type UserCredential,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { app } from './client';

let auth: Auth | null = null;
let authReadyPromise: Promise<Auth> | null = null;

// ✅ This async initializer ensures persistence is ready BEFORE any auth listeners run.
export async function getFirebaseAuth(): Promise<Auth> {
  if (!app) {
    throw new Error(
      'Firebase app is not initialized. getFirebaseAuth() can only be called on the client.'
    );
  }

  // If we already initialized and set persistence, return it
  if (auth) return auth;

  // Avoid double-initialization in React strict mode / multiple renders
  if (!authReadyPromise) {
    authReadyPromise = (async () => {
      const a = getAuth(app);
      // ✅ Critical: make auth session survive reloads/navigation
      await setPersistence(a, browserLocalPersistence);
      auth = a;
      return a;
    })();
  }

  return authReadyPromise;
}

// Re-export auth utilities
export {
  onAuthStateChanged,
  firebaseUpdateProfile,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
};
export type { User, UserCredential, Auth };
