// src/app/api/royal/inquiry/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminDb } from '@/lib/firebase/admin';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Ensure this route runs on the Node.js runtime, as firebase-admin is not compatible with the Edge runtime.
export const runtime = 'nodejs';

// Define the validation schema for the incoming request body.
const royalInquirySchema = z.object({
  eventType: z.string().min(2, 'Event type must be at least 2 characters.'),
  guestCount: z.coerce.number().min(1, 'Guest count must be at least 1.'),
  zipCode: z.string().regex(/^\d{5}$/, 'A valid 5-digit ZIP code is required.'),
  phone: z.string().min(10, 'A valid phone number is required.'),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // Lazily get the admin DB instance.
    // This call will initialize the Firebase Admin SDK if it hasn't been already.
    const adminDb = getAdminDb();

    const json = await req.json();
    const validatedData = royalInquirySchema.safeParse(json);

    if (!validatedData.success) {
      return NextResponse.json({ 
        message: 'Invalid form data.', 
        errors: validatedData.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { eventType, guestCount, zipCode, phone, notes } = validatedData.data;

    // Save the validated data to the 'royal_inquiries' collection in Firestore.
    await addDoc(collection(adminDb, 'royal_inquiries'), {
      eventType,
      guests: guestCount,
      zip: zipCode,
      phone,
      notes: notes || '',
      status: 'new', // Default status for new inquiries
      createdAt: serverTimestamp(), // Use the server's timestamp
    });

    return NextResponse.json({ message: 'Inquiry received successfully!' });

  } catch (error: any) {
    // If an error occurs (e.g., Firebase credentials not set up), log it and return a 500 error.
    console.error('Error handling Royal Celebration Jr. inquiry:', error.message);
    return NextResponse.json({ 
      message: 'An internal server error occurred.',
      error: error.message
    }, { status: 500 });
  }
}
