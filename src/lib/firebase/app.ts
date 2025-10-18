import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";

function getFirebaseWebConfig(): FirebaseOptions {
  try {
    const fromNextPublic = process.env.NEXT_PUBLIC_FIREBASE_WEBAPP_CONFIG;
    if (fromNextPublic && fromNextPublic.startsWith('{')) {
      return JSON.parse(fromNextPublic);
    }
  } catch {}

  // Fallback to server-side env var if client-side is not available
  try {
    const fromServer = process.env.FIREBASE_WEBAPP_CONFIG;
    if (fromServer && fromServer.startsWith('{')) {
      return JSON.parse(fromServer);
    }
  } catch {}
  
  // Final fallback to hardcoded values if no env vars are found
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

const config = getFirebaseWebConfig();
export const app = !getApps().length ? initializeApp(config) : getApp();
