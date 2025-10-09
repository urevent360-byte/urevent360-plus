
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

function getFirebaseWebConfig() {
  try {
    const fromNext = process.env.NEXT_PUBLIC_FIREBASE_WEBAPP_CONFIG;
    if (fromNext) return JSON.parse(fromNext);

    const fromFirebase = process.env.FIREBASE_WEBAPP_CONFIG;
    if (fromFirebase) return JSON.parse(fromFirebase);
  } catch(e) {
    console.error("Failed to parse Firebase config from environment variables.", e);
  }

  // Fallback to your known config for local development
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}


const config = getFirebaseWebConfig();

// Initialize Firebase
export const app = !getApps().length ? initializeApp(config) : getApp();
export const db = getFirestore(app);
export const storage = getStorage(app);
