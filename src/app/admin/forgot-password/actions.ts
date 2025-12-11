'use client';

import { getFirebaseAuth, sendPasswordResetEmail } from '@/lib/firebase/authClient';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email('A valid email is required.'),
});

export async function forgotPasswordAction(formData: FormData) {
  const validatedFields = formSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors.email?.[0] || 'Invalid email address.',
    };
  }
  
  const { email } = validatedFields.data;
  const auth = getFirebaseAuth();

  try {
    await sendPasswordResetEmail(auth, email);
    // For security reasons, we don't confirm if the email exists.
    // We just confirm that the process was initiated.
    return { success: true };
  } catch (error: any) {
    console.error("Password Reset Error:", error);
    // We still return success to prevent email enumeration attacks.
    // The user will get a generic success message.
    return { success: true };
  }
}
