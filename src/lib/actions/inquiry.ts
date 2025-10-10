'use server';

import { z } from 'zod';
import servicesCatalog from '@/lib/services-catalog.json';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('A valid email is required.'),
  phone: z.string().optional(),
  eventType: z.string().min(2, 'Event type is required.'),
  eventDate: z.string(),
  eventLocation: z.string().min(2, 'Location is required.'),
  services: z.array(z.string()).min(1, 'Select at least one service.'),
});

export async function submitHeroInquiryAction(formData: FormData) {
  const serviceIds = formData.getAll('services') as string[];

  const validatedFields = inquirySchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    eventType: formData.get('eventType'),
    eventDate: formData.get('eventDate'),
    eventLocation: formData.get('eventLocation'),
    services: serviceIds,
  });

  if (!validatedFields.success) {
    console.error('Validation Errors:', validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: 'Invalid form data. Please check your entries.',
    };
  }
  
  const requestedServices = validatedFields.data.services.map(serviceId => {
      const service = servicesCatalog.services.find(s => s.id === serviceId);
      return {
          serviceId,
          title: service?.label || serviceId,
          qty: 1,
          notes: 'From hero inquiry'
      };
  });

  try {
    // In a real app, you would save this to your database (e.g., Firestore)
    // to create a new lead.
    console.log('New Hero Inquiry Lead data received:', { ...validatedFields.data, requestedServices });

    // Simulate a database operation
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };
  } catch (error) {
    console.error('Error creating lead:', error);
    return { success: false, message: 'Failed to submit inquiry.' };
  }
}
