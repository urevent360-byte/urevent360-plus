
'use server';

import { z } from 'zod';

const serviceFormSchema = z.object({
  name: z.string().min(2, 'Service name is required.'),
  category: z.string().min(1, 'Category is required.'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters.'),
  longDescription: z.string().min(20, 'Long description must be at least 20 characters.'),
  metaTitle: z.string().min(5, 'SEO title is required.'),
  metaDescription: z.string().min(10, 'SEO description is required.'),
  keywords: z.string().min(1, 'Please add at least one keyword.'),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().min(2, 'Alt text is required.'),
  })),
  videos: z.array(z.object({
    url: z.string().url(),
    alt: z.string().min(2, 'Alt text is required.'),
  })).optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export async function createServiceAction(data: ServiceFormValues): Promise<{ success: boolean; message?: string }> {
  const validatedFields = serviceFormSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: 'Invalid form data.',
    };
  }

  try {
    // In a real app, you would save this to your database (e.g., Firestore)
    console.log('New service data received:', validatedFields.data);
    
    // Simulate a database operation
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };
  } catch (error) {
    console.error('Error creating service:', error);
    return { success: false, message: 'Failed to create service.' };
  }
}
