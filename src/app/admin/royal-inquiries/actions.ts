
'use server';

import { db } from '@/lib/firebase/client';
import { collection, getDocs, doc, updateDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export type RoyalInquiryStatus = 'new' | 'contacted' | 'closed';

export type RoyalInquiry = {
  id: string;
  eventType: string;
  guests: number;
  zip: string;
  phone: string;
  notes: string;
  status: RoyalInquiryStatus;
  createdAt: Timestamp;
};

export async function getRoyalInquiriesAction(): Promise<{ inquiries: RoyalInquiry[] }> {
  try {
    const inquiriesRef = collection(db, 'royal_inquiries');
    const q = query(inquiriesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const inquiries = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as RoyalInquiry));
    return { inquiries };
  } catch (error) {
    console.error('Error fetching royal inquiries:', error);
    return { inquiries: [] };
  }
}

export async function updateInquiryStatusAction(id: string, status: RoyalInquiryStatus): Promise<{ success: boolean }> {
    try {
        const inquiryRef = doc(db, 'royal_inquiries', id);
        await updateDoc(inquiryRef, { status });
        revalidatePath('/admin/royal-inquiries');
        return { success: true };
    } catch (error) {
        console.error('Error updating inquiry status:', error);
        return { success: false };
    }
}
