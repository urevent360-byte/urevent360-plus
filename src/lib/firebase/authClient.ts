// This module is safe to import on the server or client.
// It only exports a function that should be called on the client.
import { getAuth, type Auth } from "firebase/auth";
import { app } from "./client";

let auth: Auth | null = null;

// This function ensures getAuth is only called on the client.
export function getFirebaseAuth(): Auth {
  // `app` will be null on the server, so this will throw.
  // This function should only be called in client components.
  if (!app) {
    throw new Error("Firebase app is not initialized. getFirebaseAuth() can only be called on the client.");
  }
  if (!auth) {
    auth = getAuth(app);
  }
  return auth;
}
