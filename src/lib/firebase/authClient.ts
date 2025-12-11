// This module is safe to import on the server or client.
// It only exports functions that should be called on the client.
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
} from 'firebase/auth';
import { app } from './client';

let auth: Auth | null = null;

// This function ensures getAuth is only called on the client.
export function getFirebaseAuth(): Auth {
  // `app` will be null on the server, so this will throw if called on the server.
  // This function should only be called in client components or inside other functions here.
  if (!app) {
    throw new Error(
      'Firebase app is not initialized. getFirebaseAuth() can only be called on the client.'
    );
  }
  if (!auth) {
    auth = getAuth(app);
  }
  return auth;
}

// Re-export all the necessary auth functions so that no other file needs to import 'firebase/auth' directly.
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
