// This file is deprecated. Please import from '@/lib/firebase/app' or '@/lib/firebase/authClient'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { app } from "./app";
import { auth } from './authClient';

export const db = getFirestore(app);
export const storage = getStorage(app);

export { app, auth };
