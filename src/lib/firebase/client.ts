import { app } from "./app";
export { app };
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgx3p7fMTWv-9TJcc32QiKsHRMJmSrBWQ",
  authDomain: "studio-9636239298-2e252.firebaseapp.com",
  projectId: "studio-9636239298-2e252",
  storageBucket: "studio-9636239298-2e252.firebasestorage.app",
  messagingSenderId: "298341125021",
  appId: "1:298341125021:web:a0f34866c9cce9d1d6bd74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);