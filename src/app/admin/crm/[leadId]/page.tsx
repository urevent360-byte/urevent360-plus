'use client';

// This is a client component that receives the initial lead data
function LeadDetailClient({ leadId }: { leadId: string }) {
    
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Lead Detail: {leadId}</h1>
            <p className="text-muted-foreground mt-2">TODO: Build Lead Detail page with Quote Builder.</p>
        </div>
    )
}


export default function AdminLeadDetailPage({ params }: { params: { leadId: string } }) {
  // Pass server-fetched params to the client component
  return <LeadDetailClient leadId={params.leadId} />;
}
