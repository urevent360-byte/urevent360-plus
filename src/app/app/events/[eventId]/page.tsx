'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventProfileShell } from '@/components/shared/EventProfileShell';
import { getEvent } from '@/lib/data-adapter';
import type { Event } from '@/lib/data-adapter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { EventChat } from '@/components/shared/EventChat';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import Link from 'next/link';

function ActivationGate() {
    return (
        <Card>
            <CardHeader className="text-center">
                <Lock className="mx-auto h-12 w-12 text-primary mb-4" />
                <CardTitle>Your Portal is Almost Ready!</CardTitle>
                <CardDescription className="max-w-md mx-auto">
                    To unlock all features of your event portal, please complete the final steps: sign your contract and pay the deposit.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button>Sign Contract</Button>
                <Button>Pay Deposit Invoice</Button>
            </CardContent>
        </Card>
    );
}


function AppEventDetailClient({ eventId }: { eventId: string }) {
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'details');

    useEffect(() => {
        async function fetchEvent() {
            setIsLoading(true);
            const fetchedEvent = await getEvent(eventId);
            setEvent(fetchedEvent || null);
            setIsLoading(false);
        }
        fetchEvent();
    }, [eventId]);
    
    // The "booked" status unlocks the portal for the host.
    const isLocked = event?.status !== 'booked';

    if (isLoading) {
        // Show a loading state while we fetch event data
        return (
             <EventProfileShell
                event={null}
                role="host"
                isLoading={true}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            >
                <p>Loading...</p>
             </EventProfileShell>
        );
    }
    
     if (!event) {
        return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>Event not found.</AlertDescription></Alert>;
    }

    if (isLocked) {
        return <ActivationGate />;
    }

    return (
        <EventProfileShell
            event={event}
            role="host"
            isLoading={isLoading}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isLocked={isLocked}
        >
             <TabsContent value="details">
                <Card>
                    <CardHeader><CardTitle>Event Details</CardTitle></CardHeader>
                    <CardContent>
                        <p>Hello, {event.clientName}! Here you can view the core details of your event.</p>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="timeline">
                <Card>
                    <CardHeader><CardTitle>My Event Timeline</CardTitle></CardHeader>
                    <CardContent><p>TODO: Display the event timeline. Allow time change requests.</p></CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="files">
                <Card>
                    <CardHeader><CardTitle>My Files</CardTitle></CardHeader>
                    <CardContent><p>TODO: Display contracts and other shared files.</p></CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="gallery">
                <Card>
                    <CardHeader><CardTitle>My Photo Gallery</CardTitle></CardHeader>
                    <CardContent><p>TODO: Display photo booth link and guest uploads.</p></CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="music">
                <Card>
                    <CardHeader><CardTitle>My Music Playlist</CardTitle></CardHeader>
                    <CardContent><p>TODO: Build music preference lists (Must Play / Do Not Play).</p></CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="communication">
                <EventChat role="host" />
            </TabsContent>
             <TabsContent value="my-services">
                 <Card>
                    <CardHeader><CardTitle>My Services</CardTitle></CardHeader>
                    <CardContent><p>TODO: Show booked services and allow requesting add-ons.</p></CardContent>
                </Card>
            </TabsContent>
        </EventProfileShell>
    );
}


export default function AppEventDetailPage({ params }: { params: { eventId: string } }) {
  return <AppEventDetailClient eventId={params.eventId} />;
}
