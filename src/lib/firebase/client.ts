import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCgx3p7fMTWv-9TJcc32QiKsHRMJmSrBWQ",
  authDomain: "studio-9636239298-2e252.firebaseapp.com",
  projectId: "studio-9636239298-2e252",
  storageBucket: "studio-9636239298-2e252.firebasestorage.app",
  messagingSenderId: "298341125021",
  appId: "1:298341125021:web:2e4e6878c1625184d6bd74",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
