
// src/app/admin/crm/[leadId]/page.tsx
import LeadDetailClient from './client';

type Props = {
  params: { leadId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function AdminLeadDetailPage({ params }: Props) {
  const { leadId } = params;
  return <LeadDetailClient leadId={leadId} />;
}
