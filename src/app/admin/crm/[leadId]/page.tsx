import LeadDetailClient from './client';

type Props = {
  params: { leadId: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function AdminLeadDetailPage({ params }: Props) {
  const { leadId } = params;
  return <LeadDetailClient leadId={leadId} />;
}
