'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventProfileShell } from '@/components/shared/EventProfileShell';
import { getEvent, createInvoice, listFiles } from '@/lib/data-adapter';
import type { Event, FileRecord } from '@/lib/data-adapter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { EventChat } from '@/components/shared/EventChat';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, File, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';


function AdminEventDetailClient({ eventId }: { eventId: string }) {
    const [event, setEvent] = useState<Event | null>(null);
    const [files, setFiles] = useState<FileRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'details');
    const { toast } = useToast();

    useEffect(() => {
        async function fetchEventData() {
            setIsLoading(true);
            const [fetchedEvent, fetchedFiles] = await Promise.all([
                getEvent(eventId),
                listFiles(eventId)
            ]);
            setEvent(fetchedEvent || null);
            setFiles(fetchedFiles);
            setIsLoading(false);
        }
        fetchEventData();
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
                    <CardHeader>
                        <CardTitle>File Management</CardTitle>
                        <CardDescription>View and manage all files associated with this event.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Uploaded By</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {files.map(file => (
                                    <TableRow key={file.id}>
                                        <TableCell className="font-medium flex items-center gap-2"><File size={16} />{file.name}</TableCell>
                                        <TableCell><Badge variant="secondary">{file.type}</Badge></TableCell>
                                        <TableCell><Badge variant={file.status === 'signed' ? 'default' : 'outline'}>{file.status.replace('_', ' ')}</Badge></TableCell>
                                        <TableCell className="capitalize">{file.uploadedBy}</TableCell>
                                        <TableCell>{format(new Date(file.timestamp), 'PPp')}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon"><Download size={16} /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {files.length === 0 && <p className="text-center text-muted-foreground p-8">No files have been uploaded for this event yet.</p>}
                    </CardContent>
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
