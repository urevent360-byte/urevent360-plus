
import { getEvent } from '@/lib/data-adapter';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

export default async function AdminEventDetailPage({ params }: { params: { eventId: string } }) {
  const event = await getEvent(params.eventId);

  if (!event) {
    notFound();
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold">Project: {event.eventName}</h1>
      <p className="text-muted-foreground">Event ID: {event.id}</p>
      <p className="mt-2">Client: {event.clientName}</p>
      <p className="mt-2">Date: {format(new Date(event.eventDate), 'PPP')}</p>
      <p className="mt-4">TODO: Build out admin-facing project profile view.</p>
    </div>
  );
}
