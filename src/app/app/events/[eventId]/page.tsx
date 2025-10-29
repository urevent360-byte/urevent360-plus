
import * as React from 'react';
import AppEventDetailClient from './client';

type Props = {
  params: { eventId: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function AppEventDetailPage({ params }: Props) {
  const { eventId } = params;
  return <AppEventDetailClient eventId={eventId} />;
}
