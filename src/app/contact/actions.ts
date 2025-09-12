'use server';

import { routeInquiry, type RouteInquiryInput } from '@/ai/flows/route-inquiries-with-ai';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
  languagePreference: z.enum(['en', 'es']),
});

type State = {
  errors: Record<string, string[]> & { form?: string };
  message: string;
};

export async function submitInquiryAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = formSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error: Please check the form fields.',
    };
  }

  try {
    const result = await routeInquiry(validatedFields.data as RouteInquiryInput);
    console.log('AI Routing Result:', result);
    // In a real app, you would now email `result.salesContact.email`
    return {
      message: `Success!`,
      errors: {},
    };
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    return {
      message: 'An unexpected error occurred while routing your inquiry.',
      errors: { form: 'AI routing failed.' },
    };
  }
}
