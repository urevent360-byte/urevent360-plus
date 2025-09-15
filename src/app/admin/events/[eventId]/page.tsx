'use client';

function AdminEventDetailClient({ eventId }: { eventId: string }) {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Project Profile: {eventId}</h1>
            <p className="text-muted-foreground mt-2">TODO: Build Admin Event Profile page using EventProfileShell.</p>
        </div>
    );
}


export default function AdminEventDetailPage({ params }: { params: { eventId: string } }) {
    return <AdminEventDetailClient eventId={params.eventId} />;
}
