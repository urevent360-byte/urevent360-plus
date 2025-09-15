
'use client';

import { getEvent } from '@/lib/data-adapter';
import { notFound, useParams, useRouter } from 'next/navigation';
import { use, useState, useEffect } from 'react';
import type { Event, FileRecord } from '@/lib/data-adapter';
import { EventProfileShell } from '@/components/shared/EventProfileShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';
import { FileText, UploadCloud, CheckCircle, Check, Circle, ExternalLink, Calendar as CalendarIcon, Link as LinkIcon, Trash2, Download, PlusCircle, XCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import QRCode from "qrcode.react";
import { Badge } from '@/components/ui/badge';

// MOCK DATA for Timeline
const timelineItems = [
    { id: 1, time: '6:00 PM', description: 'Photo Booth Setup Begins', status: 'approved', synced: false },
    { id: 2, time: '7:00 PM', description: 'Photo Booth Opens', status: 'approved', synced: true },
    { id: 3, time: '9:00 PM', description: 'Hora Loca Performance', status: 'pending', synced: false },
    { id: 4, time: '10:00 PM', description: 'Cold Sparklers for Cake Cutting', status: 'approved', synced: false },
    { id: 5, time: '11:00 PM', description: 'Photo Booth Closes', status: 'approved', synced: true },
];

const initialServices = [
    { name: '360 Photo Booth', status: 'approved' },
    { name: 'Cold Sparklers', status: 'approved' },
    { name: 'Dance on the Clouds', status: 'requested' },
];

const availableAddons = [
    'Magic Mirror',
    'La Hora Loca with LED Robot',
    'Projector (Slideshows & Videos)',
    'Monogram Projector',
    'LED Screens Wall',
];


function AdminBillingTab({ event, setEvent }: { event: Event, setEvent: (event: Event) => void }) {
    const { toast } = useToast();

    const handleCreateInvoice = () => {
        toast({
            title: 'Invoice Created (Simulated)',
            description: 'QuickBooks invoice generated and payment record created.',
        });
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
                 {event.status === 'contract_sent' && (
                    <div className="text-center p-8 border-dashed border-2 rounded-lg">
                        <p className="mb-4 text-muted-foreground">The contract has been sent. Create an invoice to proceed.</p>
                        <Button onClick={handleCreateInvoice}>Create Invoice</Button>
                    </div>
                )}
                {event.status === 'invoice_sent' || event.status === 'deposit_due' || event.status === 'booked' || event.status === 'completed' ? (
                    <div className="p-4 bg-green-50 text-green-800 rounded-lg">
                        <h4 className="font-bold">Invoice Sent!</h4>
                        <p>The client can now view the invoice and pay the deposit in their portal.</p>
                        <p className="text-sm mt-2">QuickBooks URL (simulated): `https://quickbooks.intuit.com/inv-123`</p>
                    </div>
                ) : (
                     <p>Invoices can be created once a quote is requested.</p>
                )}
            </CardContent>
        </Card>
    );
}

function AdminFilesTab({ files, setFiles, event, setEvent }: { files: FileRecord[], setFiles: (files: FileRecord[]) => void, event: Event, setEvent: (event: Event) => void }) {
    const { toast } = useToast();
    
    const handleSendContract = () => {
        const newFile: FileRecord = {
            id: `file-${Date.now()}`,
            name: 'Event Contract',
            type: 'contract',
            status: 'pending_signature',
            url: '/placeholder-contract.pdf',
        };
        setFiles([newFile, ...files]);
        setEvent({...event, status: 'contract_sent' });
        toast({
            title: 'Contract Sent!',
            description: 'The host can now view and sign the contract.',
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Files & Documents</CardTitle>
                <CardDescription>Upload invoices, contracts, and view signed documents from the client.</CardDescription>
            </CardHeader>
            <CardContent>
                {files.length === 0 ? (
                    <div className="text-center p-8 border-dashed border-2 rounded-lg">
                        <p className="mb-4 text-muted-foreground">No files for this event yet. Send the contract to begin.</p>
                        <Button onClick={handleSendContract}><UploadCloud className="mr-2" /> Send Contract</Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {files.map(file => (
                            <Card key={file.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-6 w-6 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-sm capitalize text-muted-foreground">{file.type}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-2 text-sm ${file.status === 'signed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {file.status === 'signed' ? <CheckCircle className="h-4 w-4" /> : null}
                                    {file.status.replace('_', ' ')}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function AdminTimelineTab() {
    const { toast } = useToast();
    const [items, setItems] = useState(timelineItems);

    const handleSync = (itemId: number) => {
        setItems(items.map(item => item.id === itemId ? { ...item, synced: true } : item));
        toast({ title: 'Synced!', description: 'Item has been synced to Google Calendar.' });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Event Timeline</CardTitle>
                <CardDescription>Approve timeline items and sync them to Google Calendar.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {items.map(item => (
                        <Card key={item.id} className="p-4 flex items-center justify-between">
                            <div>
                                <span className="font-bold mr-4">{item.time}</span>
                                <span>{item.description}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                {item.status === 'pending' ? (
                                    <Button variant="outline" size="sm"><Check className="mr-2" />Approve</Button>
                                ) : (
                                    <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle/>Approved</span>
                                )}
                                <div className="flex items-center space-x-2">
                                    <Switch id={`sync-${item.id}`} checked={item.synced} onCheckedChange={() => handleSync(item.id)} />
                                    <Label htmlFor={`sync-${item.id}`} className="flex items-center gap-1">
                                        {item.synced ? <><Circle className="fill-blue-500 text-blue-500"/> Synced</> : 'Sync'}
                                    </Label>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function AdminGallerySettingsTab({event, setEvent}: {event: Event, setEvent: (event: Event) => void}) {
     const { toast } = useToast();

    const handleSave = () => {
        toast({
            title: 'Settings Saved',
            description: 'Gallery settings have been updated for this event.',
        });
    };

    const qrUrl = typeof window !== 'undefined' ? `${window.location.origin}/upload/${event.id}` : '';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Gallery Configuration</CardTitle>
                        <CardDescription>Set up the photo booth album and visibility dates for the client.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="album-url" className="flex items-center gap-2"><LinkIcon /> Photo Booth Album URL</Label>
                            <Input
                                id="album-url"
                                placeholder="https://photos.google.com/album/..."
                                value={event.photoboothLink || ''}
                                onChange={(e) => setEvent({ ...event, photoboothLink: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">Paste the public URL of the main album (e.g., from Google Photos).</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><CalendarIcon /> Gallery Visibility Date</Label>
                                <DatePicker 
                                    date={event.galleryVisibilityDate ? new Date(event.galleryVisibilityDate) : undefined} 
                                    onDateChange={(date) => setEvent({ ...event, galleryVisibilityDate: date?.toISOString() })}
                                />
                                <p className="text-xs text-muted-foreground">Date when the client can see the gallery.</p>
                            </div>
                             <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-destructive"><Trash2 /> Gallery Expiration Date</Label>
                                 <DatePicker 
                                    date={event.galleryExpirationDate ? new Date(event.galleryExpirationDate) : undefined}
                                    onDateChange={(date) => setEvent({ ...event, galleryExpirationDate: date?.toISOString() })}
                                 />
                                <p className="text-xs text-muted-foreground">Date when guest photos will be auto-purged.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Guest Uploads</CardTitle>
                        <CardDescription>Manage photos uploaded by guests.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                         <Button variant="outline"><Download className="mr-2" /> Download All as ZIP</Button>
                         <p className="text-sm text-muted-foreground mt-4">A grid of guest-uploaded photos will appear here for moderation.</p>
                    </CardContent>
                </Card>
            </div>
             <div className="space-y-8">
                 <Card>
                    <CardHeader className="text-center">
                        <CardTitle>Guest Upload QR Code</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                         <QRCode value={qrUrl} size={192} level="H" includeMargin />
                        <p className="text-xs text-muted-foreground text-center">Guests can scan this to upload photos directly to the event gallery.</p>
                        <Button variant="secondary" onClick={() => navigator.clipboard.writeText(qrUrl)}>Copy URL</Button>
                    </CardContent>
                </Card>
                <Button onClick={handleSave} className="w-full">Save Gallery Settings</Button>
            </div>
        </div>
    );
}

function AdminServicesTab() {
    const { toast } = useToast();
    const [services, setServices] = useState(initialServices);

    const handleApproval = (serviceName: string, newStatus: 'approved' | 'rejected') => {
        setServices(services.map(s => s.name === serviceName ? { ...s, status: newStatus } : s));
        toast({
            title: `Service ${newStatus === 'approved' ? 'Approved' : 'Rejected'}`,
            description: `${serviceName} has been updated.`,
        });
    };

    const requestedServices = services.filter(s => s.status === 'requested');
    const activeServices = services.filter(s => s.status !== 'requested');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <Card>
                <CardHeader>
                    <CardTitle>Requested Add-ons</CardTitle>
                    <CardDescription>Approve or reject services requested by the client.</CardDescription>
                </CardHeader>
                <CardContent>
                    {requestedServices.length > 0 ? (
                        <div className="space-y-4">
                            {requestedServices.map(service => (
                                <Card key={service.name} className="p-4 flex items-center justify-between">
                                    <p className="font-medium">{service.name}</p>
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleApproval(service.name, 'approved')}>
                                            <Check /> Approve
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleApproval(service.name, 'rejected')}>
                                            <XCircle /> Reject
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">No pending requests from the client.</p>
                    )}
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle>Active Services</CardTitle>
                    <CardDescription>Services that are part of this event's package.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="space-y-4">
                        {activeServices.map(service => (
                            <Card key={service.name} className="p-4 flex items-center justify-between bg-muted/50">
                                <p className="font-medium">{service.name}</p>
                                <Badge variant={service.status === 'approved' ? 'default' : 'destructive'} className="capitalize">
                                    {service.status}
                                </Badge>
                            </Card>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">Approved add-ons can now be added to the invoice.</p>
                </CardContent>
            </Card>
        </div>
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

    const [event, setEvent] = useState<Event | null>(null);
    const [files, setFiles] = useState<FileRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (initialEventData) {
            setEvent(initialEventData);
            if (initialEventData.status === 'booked' || initialEventData.status === 'completed' || initialEventData.status === 'deposit_due') {
                setFiles([{ id: 'file-1', name: 'Event Contract', type: 'contract', status: 'signed', url: '/placeholder-contract.pdf' }]);
            } else if (initialEventData.status === 'contract_sent' || initialEventData.status === 'invoice_sent') {
                setFiles([{ id: 'file-1', name: 'Event Contract', type: 'contract', status: 'pending_signature', url: '/placeholder-contract.pdf' }]);
            }
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
                <Card><CardHeader><CardTitle>Event Details</CardTitle><CardDescription>Manage general event information.</CardDescription></CardHeader><CardContent><p>This section will contain forms to edit the event name, date, client details, and other core information.</p></CardContent></Card>
            </TabsContent>
            <TabsContent value="billing">
                <AdminBillingTab event={event} setEvent={setEvent} />
            </TabsContent>
            <TabsContent value="timeline"><AdminTimelineTab /></TabsContent>
            <TabsContent value="files">
                <AdminFilesTab files={files} setFiles={setFiles} event={event} setEvent={setEvent} />
            </TabsContent>
            <TabsContent value="gallery">
                <AdminGallerySettingsTab event={event} setEvent={setEvent} />
            </TabsContent>
            <TabsContent value="music"><Card><CardHeader><CardTitle>Music Playlist</CardTitle><CardDescription>Review the client's music requests.</CardDescription></CardHeader><CardContent><p>Manage music requests and do-not-play lists submitted by the client.</p></CardContent></Card></TabsContent>
            <TabsContent value="communication"><Card><CardHeader><CardTitle>Communication</CardTitle><CardDescription>A dedicated chat for this event.</CardDescription></CardHeader><CardContent><p>A dedicated chat for this event between the admin and the host.</p></CardContent></Card></TabsContent>
            <TabsContent value="my-services"><AdminServicesTab /></TabsContent>
        </EventProfileShell>
    );
}

