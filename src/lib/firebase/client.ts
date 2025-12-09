// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// This function prioritizes environment variables for configuration.
const getFirebaseConfig = () => {
  // Check for Next.js public environment variables
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
  }

  // Fallback to hardcoded values if no env vars are found (for local dev without .env file)
  return {
    apiKey: 'AIzaSyCgx3p7fMTWv-9TJcc32QiKsHRMJmSrBWQ',
    authDomain: 'studio-9636239298-2e252.firebaseapp.com',
    projectId: 'studio-9636239298-2e252',
    storageBucket: 'studio-9636239298-2e252.firebasestorage.app',
    messagingSenderId: '298341125021',
    appId: '1:298341125021:web:a0f34866c9cce9d1d6bd74',
  };
};

// Detect if we are running in the browser
const isBrowser = typeof window !== 'undefined';

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;

if (isBrowser) {
  const firebaseConfig = getFirebaseConfig();
  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  firestoreDb = getFirestore(firebaseApp);

  // App Check: only in browser and only if ENV is present
  try {
    const siteKey = process.env.NEXT_PUBLIC_APP_CHECK_SITE_KEY;
    if (siteKey) {
      if (process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN === 'true') {
        // @ts-ignore
        self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      }
      initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
    }
  } catch (err) {
    console.error('App Check init error:', err);
  }
}

// Exports:
// - En el navegador: app y db reales
// - En SSR / build: null, para evitar inicializar Firebase durante el prerender
export const app = firebaseApp;
export const db = firestoreDb;
