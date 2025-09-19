'use client';

import { EventServices } from '@/components/shared/EventServices';
import { useAuth } from '@/contexts/AuthProvider';
import { useState, useEffect } from 'react';

export default function AppServicesPage() {
    const { user } = useAuth();
    const [eventId, setEventId] = useState<string | null>(null);

    // In a real app, you might fetch the user's primary/upcoming event.
    // For the prototype, we'll hardcode the main event ID we use for testing.
    useEffect(() => {
        if (user) {
            setEventId('evt-456');
        }
    }, [user]);

    if (!eventId) {
        // You could show a loader or a message to select an event
        return <p>Loading event information...</p>;
    }

    return <EventServices eventId={eventId} role="host" />;
}
