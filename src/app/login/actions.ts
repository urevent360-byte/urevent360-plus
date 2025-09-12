'use server';

import { z } from 'zod';
import { auth } from '@/lib/firebase/client';
import { signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type State = {
  errors: Record<string, string[]> & { form?: string };
  message: string;
};

export async function loginAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error: Please check the form fields.',
    };
  }

  try {
    // This is problematic because Firebase Auth is client-side.
    // We are simulating what would happen, but this needs to be refactored to be client-side.
    console.log(`Simulating login for ${validatedFields.data.email}`);
    // In a real client-side action, you would do:
    // await signInWithEmailAndPassword(auth, validatedFields.data.email, validatedFields.data.password);
    return {
      message: 'Login successful!',
      errors: {},
    };
  } catch (error: any) {
    return {
      message: 'Login failed. Please check your credentials.',
      errors: { form: error.message },
    };
  }
}


export async function socialLoginAction(provider: 'google' | 'facebook'): Promise<string | null> {
    try {
        // This logic must run on the client. This server action is a placeholder.
        console.log(`Simulating login with ${provider}`);
        // Real implementation (on client):
        // const authProvider = provider === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();
        // await signInWithPopup(auth, authProvider);
        return null;
    } catch (error: any) {
        return error.message || 'An unexpected error occurred.';
    }
}
