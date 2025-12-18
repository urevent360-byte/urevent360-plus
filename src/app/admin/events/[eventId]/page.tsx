

import * as React from 'react';
import AdminEventDetailClient from './client';
export default async function AdminEventPage({
  params,
}: {
  params: Promise<any>;
}) {

    const { eventId } = await params;
    return <AdminEventDetailClient eventId={eventId} />;
}
