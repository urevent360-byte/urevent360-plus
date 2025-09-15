'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventProfileShell } from '@/components/shared/EventProfileShell';
import { getEvent } from '@/lib/data-adapter';
import type { Event } from '@/lib/data-adapter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { EventChat } from '@/components/shared/EventChat';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';


function AdminEventDetailClient({ eventId }: { eventId: string }) {
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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
        // Mock action
        toast({
            title: "Invoice Created",
            description: "An invoice has been created and sent to the client.",
        });
        setEvent({ ...event, status: 'invoice_sent' });
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
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>Manage invoices, track payments, and view financial summaries for this event.</p>
                        <Button onClick={handleCreateInvoice} disabled={event?.status !== 'quote_requested'}>
                            Create Invoice
                        </Button>
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
