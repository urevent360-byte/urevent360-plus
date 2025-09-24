
'use client';

import { EventServices } from '@/components/shared/EventServices';
import { useAuth } from '@/contexts/AuthProvider';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppServicesPage() {
    const { user } = useAuth();
    const [eventId, setEventId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // In a real app, you might fetch the user's primary/upcoming event.
    // For the prototype, we'll hardcode the main event ID we use for testing.
    useEffect(() => {
        if (user) {
            setEventId('evt-456');
            setIsLoading(false);
        }
    }, [user]);

    return (
        <div>
            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-64 w-full" />
                </div>
            ) : eventId ? (
                <EventServices eventId={eventId} role="host" />
            ) : (
                 <p>Could not load event information.</p>
            )}
        </div>
    );
}
