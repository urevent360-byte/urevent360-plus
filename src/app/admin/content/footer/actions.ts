'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const footerFormSchema = z.object({
  email1: z.string().email('Please enter a valid email.').or(z.literal('')),
  email2: z.string().email('Please enter a valid email.').or(z.literal('')),
  phone1: z.string().min(1, 'Phone number is required.'),
  phone2: z.string().min(1, 'Spanish phone number is required.'),
  instagram: z.string().url('Please enter a valid URL.').or(z.literal('')),
  facebook: z.string().url('Please enter a valid URL.').or(z.literal('')),
  twitter: z.string().url('Please enter a valid URL.').or(z.literal('')),
});

type FooterFormValues = z.infer<typeof footerFormSchema>;

export async function updateFooterAction(data: FooterFormValues): Promise<{ success: boolean; message?: string }> {
  const validatedFields = footerFormSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: 'Invalid form data.',
    };
  }

  try {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'footer-data.json');
    
    const newFooterData = {
      contact: {
        emails: [
          { address: validatedFields.data.email1 },
          { address: validatedFields.data.email2 }
        ].filter(e => e.address),
        phones: [
          { number: validatedFields.data.phone1, label: '' },
          { number: validatedFields.data.phone2, label: 'Español' }
        ]
      },
      social: {
        instagram: validatedFields.data.instagram,
        facebook: validatedFields.data.facebook,
        twitter: validatedFields.data.twitter,
      }
    };
    
    await fs.writeFile(filePath, JSON.stringify(newFooterData, null, 2));

    return { success: true };
  } catch (error) {
    console.error('Error updating footer data:', error);
    return { success: false, message: 'Failed to save footer content.' };
  }
}
