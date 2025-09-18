

'use client';

import { useState, useEffect } from 'react';
import { EventProfileShell } from '@/components/shared/EventProfileShell';
import { getEvent, createInvoice, listFiles, simulateDepositPaid, listTimeline, toggleSyncToGoogle, listRequestedServices, approveServiceRequest, listPayments, getMusicPlaylist, listChangeRequests, approveChangeRequest, rejectChangeRequest } from '@/lib/data-adapter';
import type { Event, FileRecord, TimelineItem, RequestedService, Payment, Song, ChangeRequest } from '@/lib/data-adapter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { EventChat } from '@/components/shared/EventChat';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, File, Download, DollarSign, Check, Circle, CheckCircle, Link as LinkIcon, Clock, ExternalLink, Music, Ban, GitPullRequest, ThumbsUp, ThumbsDown, QrCode, Pause, Play, CalendarOff } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { EventGallery } from '@/components/shared/EventGallery';
import QRCode from "qrcode.react";


export default function AdminEventDetailClient({ eventId }: { eventId: string }) {
    const [event, setEvent] = useState<Event | null>(null);
    const [files, setFiles] = useState<FileRecord[]>([]);
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [requestedServices, setRequestedServices] = useState<RequestedService[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [mustPlay, setMustPlay] = useState<Song[]>([]);
    const [doNotPlay, setDoNotPlay] = useState<Song[]>([]);
    const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
    const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const { toast } = useToast();

    async function fetchEventData() {
        setIsLoading(true);
        const [fetchedEvent, fetchedFiles, fetchedTimeline, fetchedRequests, fetchedPayments, musicPlaylist, fetchedChanges] = await Promise.all([
            getEvent(eventId),
            listFiles(eventId),
            listTimeline(eventId),
            listRequestedServices(eventId),
            listPayments(eventId),
            getMusicPlaylist(eventId),
            listChangeRequests(eventId),
        ]);
        setEvent(fetchedEvent || null);
        setFiles(fetchedFiles);
        setTimeline(fetchedTimeline);
        setRequestedServices(fetchedRequests);
        setPayments(fetchedPayments);
        setChangeRequests(fetchedChanges);
        if (musicPlaylist) {
            setMustPlay(musicPlaylist.mustPlay);
            setDoNotPlay(musicPlaylist.doNotPlay);
        }
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
            await fetchEventData(); // Refetch to get updated status and payments
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

    const handleApproveChange = async (requestId: string) => {
        await approveChangeRequest(eventId, requestId);
        toast({ title: 'Change Approved!', description: 'The event details have been updated.' });
        await fetchEventData();
    };

    const handleRejectChange = async (requestId: string) => {
        await rejectChangeRequest(eventId, requestId);
        toast({ title: 'Change Rejected', description: 'The request has been marked as rejected.', variant: 'destructive' });
        await fetchEventData();
    };

    const SongList = ({ title, songs, icon }: { title: string, songs: Song[], icon: React.ReactNode }) => (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">{icon} {title}</CardTitle>
            </CardHeader>
            <CardContent>
                {songs.length > 0 ? (
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {songs.map((song, index) => (
                            <li key={index} className="border-b pb-2">{song.title} - <span className="italic">{song.artist}</span></li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">This list is empty.</p>
                )}
            </CardContent>
        </Card>
    );

    const guestUploadUrl = event?.qrUpload?.token ? `${window.location.origin}/upload/${event.qrUpload.token}` : null;

    return (
        <EventProfileShell
            event={event}
            role="admin"
            isLoading={isLoading}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        >
             <TabsContent value="details">
                 <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Controls & Event Info</CardTitle>
                             <CardDescription>
                                Key details about the event. The host sees this information in their portal.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div><strong>Project Number:</strong> {event?.projectNumber}</div>
                                <div><strong>Event Type:</strong> {event?.type}</div>
                                <div><strong>Guest Count:</strong> {event?.guestCount}</div>
                                <div><strong>Time Zone:</strong> {event?.timeZone}</div>
                                <div><strong>Venue:</strong> {event?.venue.name}, {event?.venue.address}</div>
                                <div><strong>On-site Contact:</strong> {event?.onsiteContact.name} ({event?.onsiteContact.phone})</div>
                                <div className="md:col-span-2"><strong>Host Email:</strong> {event?.hostEmail}</div>
                             </div>
                        </CardContent>
                    </Card>

                     {changeRequests.length > 0 && (
                        <Card>
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2"><GitPullRequest/> Host Change Requests</CardTitle>
                                <CardDescription>The host has requested the following changes. Approve or reject them.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {changeRequests.map(req => (
                                    <Alert key={req.id} variant={req.status === 'rejected' ? 'destructive' : 'default'}>
                                        <AlertTitle className="flex justify-between items-center">
                                            <span>Request from {format(new Date(req.submittedAt), 'PPP')} - <Badge variant="outline" className="capitalize">{req.status}</Badge></span>
                                            {req.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="secondary" onClick={() => handleApproveChange(req.id)}><ThumbsUp className="mr-2"/>Approve</Button>
                                                    <Button size="sm" variant="destructive" onClick={() => handleRejectChange(req.id)}><ThumbsDown className="mr-2"/>Reject</Button>
                                                </div>
                                            )}
                                        </AlertTitle>
                                        <AlertDescription>
                                            <ul className="list-disc list-inside mt-2">
                                               {Object.entries(req.proposedPatch).map(([key, value]) => (
                                                    <li key={key}><strong>{key}:</strong> {String(value)}</li>
                                               ))}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                ))}
                            </CardContent>
                        </Card>
                     )}
                 </div>
            </TabsContent>
            <TabsContent value="billing">
                 <Card>
                    <CardHeader>
                        <CardTitle>Billing Management</CardTitle>
                        <CardDescription>Manage invoices, track payments, and view financial summaries for this event.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <p>The current event status is: <span className="font-bold capitalize">{event?.status.replace('_', ' ')}</span></p>
                            <div className="flex gap-4 items-center">
                                <Button onClick={handleCreateInvoice} disabled={!event || !['quote_requested', 'contract_sent'].includes(event.status) || isCreatingInvoice}>
                                    {isCreatingInvoice ? <Loader2 className="mr-2 animate-spin" /> : null}
                                    Create Invoice
                                </Button>
                                {['invoice_sent', 'deposit_due'].includes(event?.status || '') && (
                                    <Button onClick={handleSimulatePayment} disabled={isSimulatingPayment} variant="secondary">
                                        {isSimulatingPayment ? <Loader2 className="mr-2 animate-spin" /> : <DollarSign className="mr-2" />}
                                        Simulate Deposit Payment
                                    </Button>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Use "Simulate Deposit Payment" to mark the deposit as paid and unlock the host portal.
                            </p>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Invoice ID</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {payments.map(payment => (
                                            <TableRow key={payment.id}>
                                                <TableCell className="font-medium">{payment.invoiceId}</TableCell>
                                                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                                                <TableCell><Badge variant={payment.status === 'paid_in_full' ? 'default' : 'destructive'} className="capitalize">{payment.status.replace('_', ' ')}</Badge></TableCell>
                                                <TableCell className="capitalize">{payment.method || 'N/A'}</TableCell>
                                                <TableCell>{format(new Date(payment.timestamp), 'PPp')}</TableCell>
                                                <TableCell className="text-right">
                                                    {payment.quickbooksUrl && (
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <a href={payment.quickbooksUrl} target="_blank" rel="noopener noreferrer">
                                                                View on QuickBooks <ExternalLink className="ml-2 h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {payments.length === 0 && <p className="text-center text-muted-foreground p-8">No invoices or payments have been recorded for this event yet.</p>}
                            </CardContent>
                        </Card>
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
                                        <TableCell><Badge variant={file.status === 'signed' ? 'default' : 'outline'} className="capitalize">{file.status.replace('_', ' ')}</Badge></TableCell>
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
                 <EventGallery 
                    role="admin"
                    event={event} 
                    onLinkChange={fetchEventData}
                 />
            </TabsContent>
             <TabsContent value="guest-qr">
                <Card>
                    <CardHeader>
                        <CardTitle>Guest Upload QR Code</CardTitle>
                        <CardDescription>Manage the QR code guests use to upload their photos to the community gallery.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-8 items-start">
                        {guestUploadUrl ? (
                            <>
                                <div className="flex items-center justify-center p-4 border rounded-lg">
                                    <QRCode
                                        value={guestUploadUrl}
                                        size={256}
                                        level={"H"}
                                        includeMargin={true}
                                    />
                                </div>
                                <div className="space-y-4">
                                     <Alert>
                                        <QrCode className="h-4 w-4" />
                                        <AlertTitle>Shareable Link</AlertTitle>
                                        <AlertDescription>
                                            <Input readOnly value={guestUploadUrl} className="mt-2 text-xs" />
                                        </AlertDescription>
                                    </Alert>
                                     <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">QR Status & Controls</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span>Status:</span>
                                                <Badge variant={event?.qrUpload?.status === 'active' ? 'default' : 'secondary'} className="capitalize">{event?.qrUpload?.status}</Badge>
                                            </div>
                                             <div className="flex items-center justify-between">
                                                <span>Expires:</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {event?.qrUpload?.expiresAt ? format(new Date(event.qrUpload.expiresAt), 'PPP p') : 'Never'}
                                                </span>
                                            </div>
                                            <div className="flex gap-2 pt-2 border-t">
                                                <Button variant="outline" size="sm"><Play className="mr-2"/>Activate</Button>
                                                <Button variant="outline" size="sm"><Pause className="mr-2"/>Pause</Button>
                                                <Button variant="destructive" size="sm"><CalendarOff className="mr-2"/>Expire Now</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </>
                        ) : (
                            <div className="md:col-span-2 text-center py-12 text-muted-foreground">
                                <p>No QR Code token has been generated for this event yet.</p>
                                <Button className="mt-4">Generate QR Token</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="music">
                <Card>
                    <CardHeader>
                        <CardTitle>Client's Music Preferences</CardTitle>
                        <CardDescription>This is a read-only view of the song lists curated by the client.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <SongList title="Must-Play List" songs={mustPlay} icon={<Music />} />
                        <SongList title="Do-Not-Play List" songs={doNotPlay} icon={<Ban />} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="communication">
                <EventChat eventId={eventId} role="admin" />
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
