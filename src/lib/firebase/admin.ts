import { getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Admin SDK (SERVER-ONLY).
// En Firebase App Hosting / Cloud Run, applicationDefault() usa las credenciales del entorno (ADC).
const adminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: applicationDefault(),
      });

export const adminDb = getFirestore(adminApp);

// Backward-compatible export used by existing routes:
export function getAdminDb() {
  return adminDb;
}
