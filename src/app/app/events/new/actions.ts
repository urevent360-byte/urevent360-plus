
'use server';

import { z } from 'zod';

const createLeadSchema = z.object({
  hostId: z.string().optional(),
  hostEmail: z.string().email(),
  name: z.string().min(2, 'Event name is required'),
  type: z.string().min(2, 'Event type is required'),
  guestCount: z.coerce.number().min(1, 'Must be at least 1'),
  date: z.date(),
  timeWindow: z.string().min(1, 'Time window is required'),
  timeZone: z.string().optional(),
  venueName: z.string().min(2, 'Venue name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(5, 'ZIP code is required'),
  onsiteContactName: z.string().min(2, 'Contact name is required'),
  onsiteContactPhone: z.string().min(10, 'A valid phone number is required'),
  notes: z.string().optional(),
  requestedServices: z.array(z.object({
      serviceId: z.string(),
      title: z.string(),
      qty: z.number(),
      notes: z.string().optional(),
  })).min(1, 'Please select at least one service'),
});

type CreateLeadInput = z.infer<typeof createLeadSchema>;

export async function createLeadAction(data: CreateLeadInput): Promise<{ success: boolean; message?: string }> {
  const validatedFields = createLeadSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: 'Invalid form data.',
    };
  }

  const { name, type, guestCount, date, timeWindow, timeZone, venueName, address, city, state, zip, onsiteContactName, onsiteContactPhone, notes, ...rest } = validatedFields.data;

  const leadData = {
    ...rest,
    status: 'new_request' as const,
    eventDraft: {
        name,
        type,
        guestCount,
        date: date.toISOString(),
        timeWindow,
        timeZone: timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        venueName,
        address,
        city,
        state,
        zip,
        onsiteContactName,
        onsiteContactPhone,
        notes,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    // In a real app, you would save this to your database (e.g., Firestore)
    console.log('New lead data to be saved:', JSON.stringify(leadData, null, 2));
    
    // Simulate a database operation
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };
  } catch (error) {
    console.error('Error creating lead:', error);
    return { success: false, message: 'Failed to create lead inquiry.' };
  }
}
