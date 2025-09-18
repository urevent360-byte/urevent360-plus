import * as React from 'react';
import AppEventDetailClient from './client';

export default function AppEventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = React.use(params);
  return <AppEventDetailClient eventId={eventId} />;
}
