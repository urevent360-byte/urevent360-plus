import { getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Admin SDK (SERVER-ONLY).
// En Firebase App Hosting / Cloud Run, applicationDefault() usa las credenciales del entorno (ADC).
// Esto evita depender de un JSON de service account en variables de entorno.
const adminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: applicationDefault(),
      });

export const adminDb = getFirestore(adminApp);
