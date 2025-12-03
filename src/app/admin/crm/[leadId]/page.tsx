// src/app/admin/crm/[leadId]/page.tsx

import LeadDetailClient from './client';

// Usamos "any" para evitar el choque con PageProps de Next.
export default function AdminLeadDetailPage({ params }: any) {
  const leadId = params?.leadId as string;

  return <LeadDetailClient leadId={leadId} />;
}
