'use server';

import { adminDb } from '@/lib/firebase/admin';

export type RoyalInquiryStatus = 'new' | 'contacted' | 'archived';

export type RoyalInquiry = {
  id: string;
  createdAt?: any;
  updatedAt?: any;

  // Campos típicos del formulario
  eventType?: string;
  phone?: string;
  guests?: number;
  zipcode?: string;
  notes?: string;

  // Control interno
  status?: RoyalInquiryStatus;
};

const COL = 'royal_inquiries';

export async function getRoyalInquiriesAction(): Promise<{ inquiries: RoyalInquiry[] }> {
  const snap = await adminDb.collection(COL).orderBy('createdAt', 'desc').get();

  const inquiries = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<RoyalInquiry, 'id'>),
  }));

  return { inquiries };
}

export async function setRoyalInquiryStatusAction(
  id: string,
  status: RoyalInquiryStatus
): Promise<{ ok: true }> {
  await adminDb.collection(COL).doc(id).set(
    {
      status,
      updatedAt: new Date(),
    },
    { merge: true }
  );

  return { ok: true };
}

export async function deleteRoyalInquiryAction(id: string): Promise<{ ok: true }> {
  await adminDb.collection(COL).doc(id).delete();
  return { ok: true };
}
