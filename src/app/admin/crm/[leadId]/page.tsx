
// src/app/admin/crm/[leadId]/page.tsx
import LeadDetailClient from './client';
type LeadPageProps = {
  params: {
    leadId: string;
  };
};


export default function AdminLeadDetailPage({ params }: LeadPageProps) {
  const { leadId } = params;
  return <LeadDetailClient leadId={leadId} />;
}
