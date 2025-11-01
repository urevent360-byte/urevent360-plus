'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/lib/firebase/error-emitter';

// This component listens for custom Firestore permission errors and throws them
// so they can be caught by the Next.js development error overlay.
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: any) => {
      // Throwing the error here will cause it to be displayed by the Next.js overlay in development.
      // This is a special component designed for debugging security rules.
      throw error;
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
        // It's good practice to clean up the listener, though in this root component it's less critical.
        // emitter.off('permission-error', handleError);
    };
  }, []);

  return null; // This component does not render anything.
}
