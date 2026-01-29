import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminDb } from '@/lib/firebase/admin';

const schema = z.object({
  eventType: z.string().min(1),
  guests: z.number().int().positive().optional(),
  phone: z.string().min(7).optional(),
  zipcode: z.string().min(3).optional(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const now = new Date();

    const docRef = await db.collection('royal_inquiries').add({
      ...parsed.data,
      status: 'new',
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ ok: true, id: docRef.id });
  } catch (err: any) {
    console.error('Royal inquiry API error:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
