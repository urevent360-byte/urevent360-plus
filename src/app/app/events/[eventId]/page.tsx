'use client';

function AppEventDetailClient({ eventId }: { eventId: string }) {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Host Project Profile: {eventId}</h1>
            <p className="text-muted-foreground mt-2">TODO: Build Host Event Profile page with Activation Gate and EventProfileShell.</p>
        </div>
    );
}


export default function AppEventDetailPage({ params }: { params: { eventId: string } }) {
  return <AppEventDetailClient eventId={params.eventId} />;
}
