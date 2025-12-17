// src/lib/firebase/admin.ts
import admin from 'firebase-admin';

// This interface defines the expected shape of the service account credentials.
interface FirebaseAdminCreds {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

/**
 * Parses and validates the service account credentials from environment variables.
 * Supports a stringified JSON object or individual credential properties.
 * @returns {FirebaseAdminCreds | null} - The parsed credentials or null if not found.
 */
function getServiceAccount(): FirebaseAdminCreds | null {
  // Option 1: A single stringified JSON object.
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      return {
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      };
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', e);
      return null;
    }
  }

  // Option 2: Individual environment variables.
  if (
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY
  ) {
    return {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // IMPORTANT: Replace escaped newlines for Vercel, Firebase, etc.
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }

  // If no credentials are found, return null.
  return null;
}

/**
 * A lazy-initialized object to hold the Firebase Admin app and services.
 * This prevents initialization from running at the top-level during module import.
 */
const firebaseAdmin = {
  app: null as admin.app.App | null,
  db: null as admin.firestore.Firestore | null,
  auth: null as admin.auth.Auth | null,

  /**
   * Initializes the Firebase Admin SDK if it hasn't been already.
   * Throws an error if service account credentials are not configured.
   */
  init() {
    if (this.app) {
      // Already initialized
      return;
    }

    const serviceAccount = getServiceAccount();

    if (!serviceAccount?.projectId || !serviceAccount?.clientEmail || !serviceAccount?.privateKey) {
      // This error will be thrown only when `init()` is called, not at module load.
      throw new Error(
        'Firebase Admin credentials are not configured. Please set the required environment variables.'
      );
    }
    
    // Only initialize if no apps exist.
    if (!admin.apps.length) {
        this.app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        this.db = admin.firestore();
        this.auth = admin.auth();
    } else {
        // If an app already exists, use it.
        this.app = admin.app();
        this.db = admin.firestore();
        this.auth = admin.auth();
    }
  },
};

/**
 * Getter for the admin Firestore instance.
 * Lazily initializes the admin app on first access.
 */
export const getAdminDb = () => {
  firebaseAdmin.init();
  // The ! asserts that db will be non-null after init()
  return firebaseAdmin.db!;
};

/**
 * Getter for the admin Auth instance.
 * Lazily initializes the admin app on first access.
 */
export const getAdminAuth = () => {
    firebaseAdmin.init();
    return firebaseAdmin.auth!;
}
