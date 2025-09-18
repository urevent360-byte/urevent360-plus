
import * as React from 'react';
import AdminEventDetailClient from './client';

export default function AdminEventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = React.use(params);
    return <AdminEventDetailClient eventId={eventId} />;
}
