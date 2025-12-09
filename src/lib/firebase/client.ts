// src/lib/firebase/client.ts

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Lee la config desde variables de entorno públicas de Next.js.
// Si no existen (por ejemplo, en algún entorno local sin .env.local),
// usa como fallback los valores hardcodeados del proyecto de Firebase.
const getFirebaseConfig = () => {
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    };
  }

  // Fallback para local dev: usa exactamente la configuración del panel de Firebase
  return {
    apiKey: 'AIzaSyCgx3p7fMTWv-9TJcc32QiKsHRMJmSrBWQ',
    authDomain: 'studio-9636239298-2e252.firebaseapp.com',
    projectId: 'studio-9636239298-2e252',
    storageBucket: 'studio-9636239298-2e252.appspot.com',
    messagingSenderId: '298341125021',
    appId: '1:298341125021:web:a0f34866c9cce9d1d6bd74',
  };
};

const firebaseConfig = getFirebaseConfig();
const isBrowser = typeof window !== 'undefined';

let firebaseApp: FirebaseApp | undefined;
let firestoreDb: Firestore | undefined;

// IMPORTANT: sólo inicializar Firebase en el navegador.
// Durante el build en servidor (SSR / prerender) no debemos crear la app
// para evitar errores de auth/invalid-api-key.
if (isBrowser) {
  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  firestoreDb = getFirestore(firebaseApp);

  // App Check: sólo en cliente
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
    // No bloquear la app si falla App Check
    console.error('App Check init error:', err);
  }
}

// Exporta siempre, pero en servidor pueden ser undefined.
// Los componentes que usan Firebase deben ser client components.
export const app = firebaseApp!;
export const db = firestoreDb!;
