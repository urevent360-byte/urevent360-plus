
'use client';

import { getEvent } from '@/lib/data-adapter';
import { notFound, useParams } from 'next/navigation';
import { use, useState, useEffect } from 'react';
import type { Event } from '@/lib/data-adapter';
import { EventProfileShell } from '@/components/shared/EventProfileShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

function AdminBillingTab({ event, setEvent }: { event: Event, setEvent: (event: Event) => void }) {
    const { toast } = useToast();

    const handleCreateInvoice = () => {
        toast({
            title: 'Invoice Created (Simulated)',
            description: 'QuickBooks invoice generated and payment record created.',
        });
        // In a real app, this would be an API call. Here we just update the state.
        setEvent({ ...event, status: 'invoice_sent' });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Billing & Invoices</CardTitle>
                <CardDescription>Create and manage invoices. The host cannot see this tab.</CardDescription>
            </CardHeader>
            <CardContent>
                {event.status === 'quote_requested' && (
                    <div className="text-center p-8 border-dashed border-2 rounded-lg">
                        <p className="mb-4 text-muted-foreground">This event is ready for an invoice.</p>
                        <Button onClick={handleCreateInvoice}>Create Invoice</Button>
                    </div>
                )}
                {event.status === 'invoice_sent' && (
                    <div className="p-4 bg-green-50 text-green-800 rounded-lg">
                        <h4 className="font-bold">Invoice Sent!</h4>
                        <p>The client can now view the invoice and pay the deposit in their portal.</p>
                        <p className="text-sm mt-2">QuickBooks URL (simulated): `https://quickbooks.intuit.com/inv-123`</p>
                    </div>
                )}
                 {event.status !== 'quote_requested' && event.status !== 'invoice_sent' && (
                     <p>Invoices can be created once a quote is requested.</p>
                )}
            </CardContent>
        </Card>
    );
}

function EventProfileLoader() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-10 w-full" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
        </div>
    )
}

export default function AdminEventDetailPage() {
    const params = useParams();
    const eventId = params.eventId as string;
    const initialEventData = use(getEvent(eventId));

    const [event, setEvent] = useState<Event | null>(initialEventData || null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (initialEventData) {
            setEvent(initialEventData);
            setIsLoading(false);
        }
    }, [initialEventData]);

    if (isLoading) {
        return <EventProfileLoader />;
    }

    if (!event) {
        notFound();
    }

    return (
        <EventProfileShell event={event} role="admin">
            <TabsContent value="details">
                <Card><CardHeader><CardTitle>Event Details</CardTitle></CardHeader><CardContent><p>Details about the event will be managed here.</p></CardContent></Card>
            </TabsContent>
            <TabsContent value="billing">
                <AdminBillingTab event={event} setEvent={setEvent} />
            </TabsContent>
            <TabsContent value="timeline"><Card><CardHeader><CardTitle>Event Timeline</CardTitle></CardHeader><CardContent><p>Admins can approve timeline items and sync them to Google Calendar.</p></CardContent></Card></TabsContent>
            <TabsContent value="files"><Card><CardHeader><CardTitle>Files</CardTitle></CardHeader><CardContent><p>Upload invoices, contracts, and other documents. View signed documents from the client.</p></CardContent></Card></TabsContent>
            <TabsContent value="gallery"><Card><CardHeader><CardTitle>Gallery Settings</CardTitle></CardHeader><CardContent><p>Configure photo booth album URLs, QR code settings, and gallery visibility windows.</p></CardContent></Card></TabsContent>
            <TabsContent value="guest-qr"><Card><CardHeader><CardTitle>Guest Upload QR Code</CardTitle></CardHeader><CardContent><p>Generate and display the QR code for guest photo uploads.</p></CardContent></Card></TabsContent>
            <TabsContent value="music"><Card><CardHeader><CardTitle>Music Playlist</CardTitle></CardHeader><CardContent><p>Manage music requests and do-not-play lists.</p></CardContent></Card></TabsContent>
            <TabsContent value="communication"><Card><CardHeader><CardTitle>Communication</CardTitle></CardHeader><CardContent><p>A dedicated chat for this event between the admin and the host.</p></CardContent></Card></TabsContent>
            <TabsContent value="my-services"><Card><CardHeader><CardTitle>Requested Services</CardTitle></CardHeader><CardContent><p>Admin can approve additional service requests from the host. Approved services are then added to the invoice.</p></CardContent></Card></TabsContent>
        </EventProfileShell>
    );
}
