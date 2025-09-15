
export default function AppEventDetailPage({ params }: { params: { eventId: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">My Event Profile</h1>
      <p className="text-muted-foreground">Event ID: {params.eventId}</p>
      <p className="mt-4">TODO: Build out client-facing project profile view with activation gate.</p>
    </div>
  );
}
