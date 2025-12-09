
import * as React from 'react';
import AdminEventDetailClient from './client';
export default async function AdminEventPage({
  params,
  searchParams,
}: any) {

    const { eventId } = params;
    return <AdminEventDetailClient eventId={eventId} />;
}
