
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthProvider';
import { listHostEvents, type Event } from '@/lib/data-adapter';
import { Skeleton } from '@/components/ui/skeleton';
import { ListTree } from 'lucide-react';

export default function AppTimelinePage() {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            if (user?.uid) { // Assuming user object has a uid for hostId
                setIsLoading(true);
                const hostEvents = await listHostEvents(user.uid);
                setEvents(hostEvents);
                setIsLoading(false);
            } else if (user) {
                // Fallback for mock environment where uid might not exist
                 const hostEvents = await listHostEvents('user-davidlee'); // mock hostId
                 setEvents(hostEvents);
                 setIsLoading(false);
            }
        }
        fetchEvents();
    }, [user]);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Event Timelines</h1>
                    <p className="text-muted-foreground">Select an event to review its schedule.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Event Schedules</CardTitle>
                        <CardDescription>A list of all your events. Click to view the detailed timeline for each.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {events.length > 0 ? (
                            events.map((event) => (
                                <Card key={event.id}>
                                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                                        <div className="md:col-span-2">
                                            <h3 className="font-semibold">{event.eventName}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(event.eventDate), 'PPP')}
                                            </p>
                                        </div>
                                        <div>
                                            <Badge variant={event.status === 'booked' || event.status === 'completed' ? 'default' : 'outline'} className="capitalize">
                                                {event.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-start md:justify-end">
                                            <Button asChild>
                                                <Link href={`/app/events/${event.id}?tab=timeline`}>
                                                    <ListTree className="mr-2"/>
                                                    View Timeline
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                             <div className="text-center text-muted-foreground py-12">
                                <p>You don't have any events with us yet.</p>
                                <Button variant="link" asChild className="mt-2">
                                    <Link href="/contact">Request an Inquiry</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
