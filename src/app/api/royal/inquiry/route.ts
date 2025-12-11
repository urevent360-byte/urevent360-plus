
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const royalInquirySchema = z.object({
  eventType: z.string().min(2),
  guestCount: z.coerce.number().min(1),
  zipCode: z.string().regex(/^\d{5}$/),
  phone: z.string().min(10),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const validatedData = royalInquirySchema.safeParse(json);

    if (!validatedData.success) {
      return NextResponse.json({ message: 'Invalid form data.', errors: validatedData.error.flatten().fieldErrors }, { status: 400 });
    }

    const { eventType, guestCount, zipCode, phone, notes } = validatedData.data;

    // Save to Firestore using the admin SDK
    await addDoc(collection(adminDb, 'royal_inquiries'), {
      eventType,
      guests: guestCount,
      zip: zipCode,
      phone,
      notes: notes || '',
      status: 'new',
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ message: 'Inquiry received successfully!' });

  } catch (error) {
    console.error('Error handling Royal Celebration Jr. inquiry:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
