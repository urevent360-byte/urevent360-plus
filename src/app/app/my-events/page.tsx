
import { listHostEvents } from '@/lib/data-adapter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function AppMyEventsPage() {
  // In a real app, the UID would come from the authenticated user session.
  const hostId = 'client-123';
  const events = await listHostEvents(hostId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Events</h1>
      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <Link href={`/app/events/${event.id}`} key={event.id}>
              <Card className="hover:bg-muted/50 cursor-pointer">
                <CardHeader>
                  <CardTitle>{event.eventName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Date: {format(new Date(event.eventDate), 'PPP')}</p>
                  <p>Status: <span className="capitalize">{event.status.replace('_', ' ')}</span></p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p>You have no events scheduled.</p>
      )}
      <p className="mt-4">TODO: Add counters and better styling.</p>
    </div>
  );
}
