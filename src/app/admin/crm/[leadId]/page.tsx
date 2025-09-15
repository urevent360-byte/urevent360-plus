
export default function AdminLeadDetailPage({ params }: { params: { leadId: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Lead Detail Page</h1>
      <p className="text-muted-foreground">Lead ID: {params.leadId}</p>
      <p className="mt-4">TODO: Build out lead detail view with Quote Builder and actions.</p>
    </div>
  );
}
