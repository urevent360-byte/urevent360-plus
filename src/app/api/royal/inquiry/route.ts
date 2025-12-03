
import { NextResponse } from 'next/server';
import { z } from 'zod';

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

    // In a real app, you would save this to Firestore in a new collection, e.g., 'royalInquiries'.
    console.log('Received new Royal Celebration Jr. inquiry:', validatedData.data);
    
    // Simulate DB save
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({ message: 'Inquiry received successfully!' });

  } catch (error) {
    console.error('Error handling Royal Celebration Jr. inquiry:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
