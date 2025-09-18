
import * as React from 'react';
import LeadDetailClient from './client';

export default function AdminLeadDetailPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = React.use(params);
  return <LeadDetailClient leadId={leadId} />;
}
