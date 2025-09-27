
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCgx3p7fMTWv-9TJcc32QiKsHRMJmSrBWQ",
  authDomain: "studio-9636239298-2e252.firebaseapp.com",
  projectId: "studio-9636239298-2e252",
  storageBucket: "studio-9636239298-2e252.appspot.com",
  messagingSenderId: "298341125021",
  appId: "1:298341125021:web:abaa2c228a0fdebed6bd74"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
