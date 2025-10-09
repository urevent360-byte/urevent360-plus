import { initializeApp, getApps, getApp } from "firebase/app";

function getFirebaseWebConfig() {
  try {
    const fromNext = process.env.NEXT_PUBLIC_FIREBASE_WEBAPP_CONFIG;
    const fromFirebase = process.env.FIREBASE_WEBAPP_CONFIG;
    if (fromNext) return JSON.parse(fromNext);
    if (fromFirebase) return JSON.parse(fromFirebase);
  } catch {}
  return {
    apiKey: "AIzaSyCgx3p7fMTWv-9TJcc32QiKsHRMJmSrBWQ",
    authDomain: "studio-9636239298-2e252.firebaseapp.com",
    projectId: "studio-9636239298-2e252",
    storageBucket: "studio-9636239298-2e252.firebasestorage.app",
    messagingSenderId: "298341125021",
    appId: "1:298341125021:web:2e4e6878c1625184d6bd74"
  };
}

const config = getFirebaseWebConfig();
export const app = !getApps().length ? initializeApp(config) : getApp();
