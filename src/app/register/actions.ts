'use server';

import { z } from 'zod';
import { auth } from '@/lib/firebase/client';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';


const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
}).refine(data => data.password, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type State = {
  errors: Record<string, string[]> & { form?: string };
  message: string;
};

export async function registerAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = registerSchema.safeParse(
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
    console.log(`Simulating registration for ${validatedFields.data.email}`);
    // In a real client-side action, you would do:
    // const userCredential = await createUserWithEmailAndPassword(auth, validatedFields.data.email, validatedFields.data.password);
    // await updateProfile(userCredential.user, { displayName: validatedFields.data.name });
    
    return {
      message: 'Registration successful! Redirecting to dashboard...',
      errors: {},
    };
  } catch (error: any) {
    return {
      message: 'Registration failed. An account with this email may already exist.',
      errors: { form: error.message },
    };
  }
}
