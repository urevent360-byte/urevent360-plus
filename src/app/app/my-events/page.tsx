
import { listHostEvents } from '@/lib/data-adapter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function AppMyEventsPage() {
  // In a real app, the UID would come from the authenticated user session.
  // We use a hardcoded ID here to simulate fetching events for a specific user.
  const hostId = 'client-123'; 
  const events = await listHostEvents(hostId);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
          <p className="text-muted-foreground">A list of all your scheduled events with us.</p>
        </div>
      </div>
      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <Link href={`/app/events/${event.id}`} key={event.id}>
              <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                <CardHeader>
                  <CardTitle>{event.eventName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Date: <span className="font-medium text-foreground">{format(new Date(event.eventDate), 'PPP')}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Status: <span className="capitalize font-medium text-foreground">{event.status.replace('_', ' ')}</span>
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
                You have no events scheduled with us yet.
            </CardContent>
        </Card>
      )}
    </div>
  );
}
