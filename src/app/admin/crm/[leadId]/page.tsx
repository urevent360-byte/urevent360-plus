
// src/app/admin/crm/[leadId]/page.tsx

import LeadDetailClient from './client';

// Usamos "any" para evitar el choque con PageProps de Next.
export default async function AdminLeadDetailPage({ params }: { params: Promise<any> }) {
  const { leadId } = await params;

  return <LeadDetailClient leadId={leadId as string} />;
}
