'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventProfileShell } from '@/components/shared/EventProfileShell';
import { getEvent, createInvoice } from '@/lib/data-adapter';
import type { Event } from '@/lib/data-adapter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { EventChat } from '@/components/shared/EventChat';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';


function AdminEventDetailClient({ eventId }: { eventId: string }) {
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'details');
    const { toast } = useToast();

    useEffect(() => {
        async function fetchEvent() {
            setIsLoading(true);
            const fetchedEvent = await getEvent(eventId);
            setEvent(fetchedEvent || null);
            setIsLoading(false);
        }
        fetchEvent();
    }, [eventId]);

    const handleCreateInvoice = async () => {
        if (!event) return;
        setIsCreatingInvoice(true);
        try {
            await createInvoice(event.id);
            const updatedEvent = await getEvent(event.id); // Re-fetch to get updated status
            setEvent(updatedEvent || null);
            toast({
                title: "Invoice Created",
                description: "An invoice has been simulated and the event status is now 'Invoice Sent'.",
            });
        } catch (error) {
             toast({
                title: "Error",
                description: "Failed to create invoice.",
                variant: "destructive"
            });
        } finally {
            setIsCreatingInvoice(false);
        }
    }

    return (
        <EventProfileShell
            event={event}
            role="admin"
            isLoading={isLoading}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        >
             <TabsContent value="details">
                <Card>
                    <CardHeader><CardTitle>Admin Details</CardTitle></CardHeader>
                    <CardContent><p>TODO: Admin-specific event details and settings.</p></CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="billing">
                 <Card>
                    <CardHeader>
                        <CardTitle>Billing Management</CardTitle>
                        <CardDescription>Manage invoices, track payments, and view financial summaries for this event.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>The current event status is: <span className="font-bold capitalize">{event?.status.replace('_', ' ')}</span></p>
                        <Button onClick={handleCreateInvoice} disabled={event?.status !== 'quote_requested' || isCreatingInvoice}>
                            {isCreatingInvoice ? <Loader2 className="mr-2 animate-spin" /> : null}
                            Create Invoice
                        </Button>
                         <p className="text-sm text-muted-foreground">
                            This action will mark the event status as "Invoice Sent" and generate a placeholder invoice for the client.
                        </p>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="timeline">
                <Card>
                    <CardHeader><CardTitle>Timeline Management</CardTitle></CardHeader>
                    <CardContent><p>TODO: Build admin timeline editor with approval and sync controls.</p></CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="files">
                <Card>
                    <CardHeader><CardTitle>File Management</CardTitle></CardHeader>
                    <CardContent><p>TODO: Build admin file manager (contracts, invoices, etc.).</p></CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="gallery">
                <Card>
                    <CardHeader><CardTitle>Gallery Management</CardTitle></CardHeader>
                    <CardContent><p>TODO: Build admin gallery controls (set Photo Booth link, manage guest uploads).</p></CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="music">
                <Card>
                    <CardHeader><CardTitle>Music Playlist</CardTitle></CardHeader>
                    <CardContent><p>TODO: View client's music selections.</p></CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="communication">
                <EventChat role="admin" />
            </TabsContent>
             <TabsContent value="my-services">
                 <Card>
                    <CardHeader><CardTitle>Service & Add-on Management</CardTitle></CardHeader>
                    <CardContent><p>TODO: View booked services and approve requested add-ons.</p></CardContent>
                </Card>
            </TabsContent>
        </EventProfileShell>
    );
}


export default function AdminEventDetailPage({ params }: { params: { eventId: string } }) {
    return <AdminEventDetailClient eventId={params.eventId} />;
}
