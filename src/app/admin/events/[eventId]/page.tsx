
export default function AdminEventDetailPage({ params }: { params: { eventId: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Event Detail Page</h1>
      <p className="text-muted-foreground">Event ID: {params.eventId}</p>
      <p className="mt-4">TODO: Build out admin-facing project profile view.</p>
    </div>
  );
}
