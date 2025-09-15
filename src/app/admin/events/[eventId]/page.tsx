
import { getEvent } from '@/lib/data-adapter';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { EventProfileShell } from '@/components/shared/EventProfileShell';

export default function AdminEventDetailPage({ params }: { params: { eventId: string } }) {
  const eventData = use(getEvent(params.eventId));

  if (!eventData) {
    notFound();
  }

  return (
    <EventProfileShell event={eventData} role="admin">
        {/* Children for tab contents will go here in a future step */}
    </EventProfileShell>
  );
}
