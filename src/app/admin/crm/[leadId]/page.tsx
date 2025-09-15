
import { getLead } from '@/lib/data-adapter';
import { notFound } from 'next/navigation';

export default async function AdminLeadDetailPage({ params }: { params: { leadId: string } }) {
  const lead = await getLead(params.leadId);

  if (!lead) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Lead: {lead.name}</h1>
      <p className="text-muted-foreground">Lead ID: {lead.id}</p>
      <p className="mt-4">Email: {lead.email}</p>
      <p className="mt-4">TODO: Build out lead detail view with Quote Builder and actions.</p>
    </div>
  );
}
