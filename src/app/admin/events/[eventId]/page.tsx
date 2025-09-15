'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventProfileShell } from '@/components/shared/EventProfileShell';
import { getEvent, createInvoice, listFiles, simulateDepositPaid, listTimeline, toggleSyncToGoogle, listRequestedServices, approveServiceRequest } from '@/lib/data-adapter';
import type { Event, FileRecord, TimelineItem, RequestedService } from '@/lib/data-adapter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { EventChat } from '@/components/shared/EventChat';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, File, Download, DollarSign, Check, Circle, CheckCircle, Link as LinkIcon, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';


function AdminEventDetailClient({ eventId }: { eventId: string }) {
    const [event, setEvent] = useState<Event | null>(null);
    const [files, setFiles] = useState<FileRecord[]>([]);
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [requestedServices, setRequestedServices] = useState<RequestedService[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
    const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'details');
    const { toast } = useToast();

    async function fetchEventData() {
        setIsLoading(true);
        const [fetchedEvent, fetchedFiles, fetchedTimeline, fetchedRequests] = await Promise.all([
            getEvent(eventId),
            listFiles(eventId),
            listTimeline(eventId),
            listRequestedServices(eventId)
        ]);
        setEvent(fetchedEvent || null);
        setFiles(fetchedFiles);
        setTimeline(fetchedTimeline);
        setRequestedServices(fetchedRequests);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchEventData();
    }, [eventId]);

    const handleCreateInvoice = async () => {
        if (!event) return;
        setIsCreatingInvoice(true);
        try {
            await createInvoice(event.id);
            await fetchEventData(); // Refetch to get updated status
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

    const handleSimulatePayment = async () => {
        if (!event) return;
        setIsSimulatingPayment(true);
        try {
            await simulateDepositPaid(event.id);
            await fetchEventData();
            toast({
                title: "Payment Simulated",
                description: "The deposit has been marked as paid and the event is now booked.",
            });
        } catch (error) {
             toast({
                title: "Error",
                description: "Failed to simulate payment.",
                variant: "destructive"
            });
        } finally {
            setIsSimulatingPayment(false);
        }
    }
    
     const handleSyncToGoogle = async (itemId: string | 'all') => {
        if (!event) return;
        await toggleSyncToGoogle(event.id, itemId);
        toast({
            title: "Syncing to Google...",
            description: "The selected timeline items are being synced.",
        });
        // Refetch to show updated sync status
        const fetchedTimeline = await listTimeline(eventId);
        setTimeline(fetchedTimeline);
    };

    const handleApproveRequest = async (requestId: string) => {
        if (!event) return;
        await approveServiceRequest(eventId, requestId);
        toast({
            title: "Service Approved",
            description: "The service request has been approved and can now be added to an invoice.",
        });
        await fetchEventData();
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
                        <div className="flex gap-4 items-center">
                            <Button onClick={handleCreateInvoice} disabled={!event || event.status !== 'quote_requested' || isCreatingInvoice}>
                                {isCreatingInvoice ? <Loader2 className="mr-2 animate-spin" /> : null}
                                Create Invoice
                            </Button>
                            {event?.status === 'invoice_sent' && (
                                <Button onClick={handleSimulatePayment} disabled={isSimulatingPayment} variant="secondary">
                                    {isSimulatingPayment ? <Loader2 className="mr-2 animate-spin" /> : <DollarSign className="mr-2" />}
                                    Simulate Deposit Payment
                                </Button>
                            )}
                        </div>
                         <p className="text-sm text-muted-foreground">
                            "Create Invoice" will mark the event status as "Invoice Sent". Use "Simulate Deposit Payment" for testing the host portal unlock.
                        </p>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="timeline">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Timeline Management</CardTitle>
                            <CardDescription>Approve items and sync the schedule to Google Calendar.</CardDescription>
                        </div>
                        <Button onClick={() => handleSyncToGoogle('all')}>Sync All to Google</Button>
                    </CardHeader>
                     <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {timeline.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-mono text-sm">
                                            {format(new Date(item.startTime), 'p')} - {format(new Date(item.endTime), 'p')}
                                        </TableCell>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.isSyncedToGoogle ? 'default' : 'secondary'} className="gap-1">
                                                {item.isSyncedToGoogle ? <CheckCircle size={14} /> : <Circle size={14}/>}
                                                {item.isSyncedToGoogle ? 'Synced' : 'Not Synced'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                             <Button variant="ghost" size="sm"><Check className="mr-2" />Approve</Button>
                                             <Button variant="ghost" size="sm" onClick={() => handleSyncToGoogle(item.id)}>
                                                 <LinkIcon className="mr-2" />Sync Item
                                             </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {timeline.length === 0 && <p className="text-center text-muted-foreground p-8">No timeline items have been added for this event yet.</p>}
                    </CardContent>
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
                    <CardHeader>
                        <CardTitle>Service & Add-on Management</CardTitle>
                        <CardDescription>Review and approve requested add-on services from the client.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Service Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requestedServices.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell className="font-medium">{req.serviceName}</TableCell>
                                        <TableCell>
                                            <Badge variant={req.status === 'approved' ? 'default' : 'outline'} className="capitalize">{req.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {req.status === 'requested' && (
                                                <Button size="sm" onClick={() => handleApproveRequest(req.id)}>
                                                    <Check className="mr-2" />
                                                    Approve
                                                </Button>
                                            )}
                                             {req.status === 'approved' && (
                                                <Button size="sm" variant="secondary">
                                                    Add to Invoice
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {requestedServices.length === 0 && <p className="text-center text-muted-foreground p-8">No add-on services have been requested for this event.</p>}
                    </CardContent>
                </Card>
            </TabsContent>
        </EventProfileShell>
    );
}


export default function AdminEventDetailPage({ params }: { params: { eventId: string } }) {
    return <AdminEventDetailClient eventId={params.eventId} />;
}
