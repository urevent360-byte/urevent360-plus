

'use client';

import { useState, useEffect } from 'react';
import { EventProfileShell } from '@/components/shared/EventProfileShell';
import type { Event, FileRecord, TimelineItem, RequestedService, Payment, Song, ChangeRequest } from '@/lib/data-adapter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { EventChat } from '@/components/shared/EventChat';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, File, Download, DollarSign, Check, CheckCircle, Link as LinkIcon, GitPullRequest, ThumbsUp, ThumbsDown, QrCode, Pause, Play, CalendarOff, Music, Ban } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { EventGallery } from '@/components/shared/EventGallery';
import QRCode from "qrcode.react";
import { Input } from '@/components/ui/input';
import { EventServices } from '@/components/shared/EventServices';

// Mock functions to replace data-adapter
async function getEvent(eventId: string): Promise<Event | undefined> { console.log(`MOCK: getEvent ${eventId}`); return undefined; }
async function createInvoice(eventId: string) { console.log(`MOCK: createInvoice ${eventId}`); }
async function listFiles(eventId: string): Promise<FileRecord[]> { console.log(`MOCK: listFiles ${eventId}`); return []; }
async function simulateDepositPaid(eventId: string) { console.log(`MOCK: simulateDepositPaid ${eventId}`); }
async function listTimeline(eventId: string): Promise<TimelineItem[]> { console.log(`MOCK: listTimeline ${eventId}`); return []; }
async function toggleSyncToGoogle(eventId: string, itemId: string | 'all') { console.log(`MOCK: toggleSyncToGoogle ${eventId}, ${itemId}`); }
async function listRequestedServices(eventId: string): Promise<RequestedService[]> { console.log(`MOCK: listRequestedServices ${eventId}`); return []; }
async function approveServiceRequest(eventId: string, requestId: string) { console.log(`MOCK: approveServiceRequest ${eventId}, ${requestId}`); }
async function listPayments(eventId: string): Promise<Payment[]> { console.log(`MOCK: listPayments ${eventId}`); return []; }
async function getMusicPlaylist(eventId: string): Promise<{ mustPlay: Song[], doNotPlay: Song[] } | null> { console.log(`MOCK: getMusicPlaylist ${eventId}`); return null; }
async function listChangeRequests(eventId: string): Promise<ChangeRequest[]> { console.log(`MOCK: listChangeRequests ${eventId}`); return []; }
async function approveChangeRequest(eventId: string, requestId: string) { console.log(`MOCK: approveChangeRequest ${eventId}, ${requestId}`); }
async function rejectChangeRequest(eventId: string, requestId: string) { console.log(`MOCK: rejectChangeRequest ${eventId}, ${requestId}`); }
async function regenerateQrToken(eventId: string) { console.log(`MOCK: regenerateQrToken ${eventId}`); }
async function pauseQr(eventId: string) { console.log(`MOCK: pauseQr ${eventId}`); }
async function activateQr(eventId: string) { console.log(`MOCK: activateQr ${eventId}`); }
async function expireQrNow(eventId: string) { console.log(`MOCK: expireQrNow ${eventId}`); }
async function handleDepositWebhookFlow(payload: { eventId: string, invoiceId: string }) { console.log(`MOCK: handleDepositWebhookFlow`, payload); }

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
        setFiles(fetchedFiles as any);
        setTimeline(fetchedTimeline as any);
        setRequestedServices(fetchedRequests as any);
        setPayments(fetchedPayments as any);
        setChangeRequests(fetchedChanges as any);
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
            const activeInvoice: any = payments.find((p: any) => p.isActive);
            if (!activeInvoice) {
                toast({ title: "No Active Invoice", description: "There is no active invoice to pay.", variant: "destructive" });
                setIsSimulatingPayment(false);
                return;
            }
            // This now calls the Genkit flow to simulate a webhook
            await handleDepositWebhookFlow({ eventId: event.id, invoiceId: activeInvoice.invoiceId });
            await simulateDepositPaid(event.id); // This function updates the local mock data
            await fetchEventData(); // Refetch data to reflect backend changes
            toast({
                title: "Payment Webhook Simulated",
                description: "The deposit payment webhook has been processed. The event is now booked.",
            });
        } catch (error) {
             toast({
                title: "Error",
                description: "Failed to simulate payment webhook.",
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
        setTimeline(fetchedTimeline as any);
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

    const guestUploadUrl = (event as any)?.qrUpload?.token ? `${window.location.origin}/upload/${(event as any).qrUpload.token}` : null;

    const handleQrAction = async (action: 'regenerate' | 'pause' | 'activate' | 'expire') => {
        if (!event) return;
        let toastTitle = '';
        let toastDescription = '';
    
        try {
            if (action === 'regenerate') {
                await regenerateQrToken(eventId);
                toastTitle = 'QR Token Regenerated';
                toastDescription = 'A new QR code and link have been generated. The old ones are now invalid.';
            } else if (action === 'pause') {
                await pauseQr(eventId);
                toastTitle = 'QR Paused';
                toastDescription = 'Guest uploads are now paused.';
            } else if (action === 'activate') {
                await activateQr(eventId);
                toastTitle = 'QR Activated';
                toastDescription = 'Guest uploads are now active.';
            } else if (action === 'expire') {
                await expireQrNow(eventId);
                toastTitle = 'QR Expired';
                toastDescription = 'The QR code has been manually expired.';
            }
            
            toast({ title: toastTitle, description: toastDescription });
            await fetchEventData(); // Refetch to show the updated QR state
        } catch (error) {
            toast({ title: "Error", description: `Failed to perform action: ${action}`, variant: "destructive" });
        }
    };
    
    const activePayment: any = payments.find((p: any) => p.isActive);

    return (
        <EventProfileShell
            event={event as any}
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
                                <div><strong>Project Number:</strong> {(event as any)?.projectNumber}</div>
                                <div><strong>Event Type:</strong> {event?.type}</div>
                                <div><strong>Guest Count:</strong> {(event as any)?.guestCount}</div>
                                <div><strong>Time Zone:</strong> {(event as any)?.timeZone}</div>
                                <div><strong>Venue:</strong> {(event as any)?.venue.name}, {(event as any)?.venue.address}</div>
                                <div><strong>On-site Contact:</strong> {(event as any)?.onsiteContact.name} ({(event as any)?.onsiteContact.phone})</div>
                                <div className="md:col-span-2"><strong>Host Email:</strong> {(event as any)?.hostEmail}</div>
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
                                {changeRequests.map((req: any) => (
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
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Billing Management</CardTitle>
                            <CardDescription>Manage invoices, track payments, and view financial summaries for this event.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p>The current event status is: <span className="font-bold capitalize">{(event?.status as any)?.replace('_', ' ')}</span></p>
                            <div className="flex gap-4 items-center">
                                <Button onClick={handleCreateInvoice} disabled={!event || !['quote_requested'].includes(event.status as any) || isCreatingInvoice}>
                                    {isCreatingInvoice ? <Loader2 className="mr-2 animate-spin" /> : null}
                                    Create Invoice
                                </Button>
                                {['invoice_sent', 'deposit_due'].includes((event?.status as any) || '') && (
                                    <Button onClick={handleSimulatePayment} disabled={isSimulatingPayment} variant="secondary">
                                        {isSimulatingPayment ? <Loader2 className="mr-2 animate-spin" /> : <DollarSign className="mr-2" />}
                                        Simulate Deposit Payment
                                    </Button>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Use "Simulate Deposit Payment" to trigger the webhook that marks the deposit as paid and unlocks the host portal.
                            </p>
                        </CardContent>
                    </Card>

                    {activePayment ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Financial Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Invoice Total</span>
                                        <span className="font-bold text-lg">${activePayment.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-green-600">
                                        <span className="">Amount Paid</span>
                                        <span className="font-bold text-lg">${activePayment.depositPaid.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center font-semibold text-destructive">
                                        <span className="">Remaining Balance</span>
                                        <span className="font-bold text-lg">${activePayment.remaining.toFixed(2)}</span>
                                    </div>
                                     <Badge variant={activePayment.status === 'paid_in_full' ? 'default' : 'destructive'} className="capitalize w-full justify-center py-2 text-md">
                                        {activePayment.status.replace(/_/g, ' ')}
                                    </Badge>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                    <CardTitle>Payment History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Note</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {activePayment.history && activePayment.history.length > 0 ? (
                                                activePayment.history.map((item: any, index: number) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{format(new Date(item.ts), 'PP')}</TableCell>
                                                        <TableCell>${item.amount.toFixed(2)}</TableCell>
                                                        <TableCell>{item.note}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow><TableCell colSpan={3} className="text-center">No payments recorded yet.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="text-center text-muted-foreground p-8">
                                No active invoice has been created for this event yet.
                            </CardContent>
                        </Card>
                    )}
                </div>
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
                                {timeline.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-mono text-sm">
                                            {format(new Date(item.startTime), 'p')} - {format(new Date(item.endTime), 'p')}
                                        </TableCell>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.isSyncedToGoogle ? 'default' : 'secondary'} className="gap-1">
                                                {item.isSyncedToGoogle ? <CheckCircle size={14} /> : <Loader2 size={14} className="animate-spin" />}
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
                                {files.map((file: any) => (
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
                    event={event as any} 
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
                                <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                                    <QRCode
                                        value={guestUploadUrl}
                                        size={256}
                                        level={"H"}
                                        includeMargin={true}
                                    />
                                    <Button variant="outline" className="mt-4" >Download QR</Button>
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
                                                <Badge variant={(event as any)?.qrUpload?.status === 'active' ? 'default' : 'secondary'} className="capitalize">{(event as any)?.qrUpload?.status}</Badge>
                                            </div>
                                             <div className="flex items-center justify-between">
                                                <span>Expires:</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {(event as any)?.qrUpload?.expiresAt ? format(new Date((event as any).qrUpload.expiresAt), 'PPP p') : 'Never'}
                                                </span>
                                            </div>
                                            <div className="flex gap-2 pt-2 border-t">
                                                <Button variant="outline" size="sm" onClick={() => handleQrAction('activate')}><Play className="mr-2"/>Activate</Button>
                                                <Button variant="outline" size="sm" onClick={() => handleQrAction('pause')}><Pause className="mr-2"/>Pause</Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleQrAction('expire')}><CalendarOff className="mr-2"/>Expire Now</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                     <Button variant="secondary" className="w-full" onClick={() => handleQrAction('regenerate')}>Regenerate QR Token</Button>
                                </div>
                            </>
                        ) : (
                            <div className="md:col-span-2 text-center py-12 text-muted-foreground">
                                <p>No QR Code token has been generated for this event yet.</p>
                                <Button className="mt-4" onClick={() => handleQrAction('regenerate')}>Generate QR Token</Button>
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
                 <EventServices eventId={eventId} role="admin" onDataChange={fetchEventData} />
            </TabsContent>
        </EventProfileShell>
    );
}
