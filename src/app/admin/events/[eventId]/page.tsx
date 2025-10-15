import * as React from 'react';
import AdminEventDetailClient from './client';

type Props = {
  params: { eventId: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function AdminEventDetailPage({ params }: Props) {
    const { eventId } = params;
    return <AdminEventDetailClient eventId={eventId} />;
}
