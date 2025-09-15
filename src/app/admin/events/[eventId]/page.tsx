
'use client';

import { getEvent } from '@/lib/data-adapter';
import { notFound, useParams } from 'next/navigation';
import { use, useState, useEffect } from 'react';
import type { Event, FileRecord } from '@/lib/data-adapter';
import { EventProfileShell } from '@/components/shared/EventProfileShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';
import { File, UploadCloud, CheckCircle } from 'lucide-react';

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
                {event.status === 'invoice_sent' && (
                    <div className="p-4 bg-green-50 text-green-800 rounded-lg">
                        <h4 className="font-bold">Invoice Sent!</h4>
                        <p>The client can now view the invoice and pay the deposit in their portal.</p>
                        <p className="text-sm mt-2">QuickBooks URL (simulated): `https://quickbooks.intuit.com/inv-123`</p>
                    </div>
                )}
                 {event.status !== 'quote_requested' && event.status !== 'invoice_sent' && event.status !== 'contract_sent' && (
                     <p>Invoices can be created once a quote is requested.</p>
                )}
            </CardContent>
        </Card>
    );
}

function AdminFilesTab({ files, setFiles, event, setEvent }: { files: FileRecord[], setFiles: (files: FileRecord[]) => void, event: Event, setEvent: (event: Event) => void }) {
    const { toast } = useToast();
    
    const handleSendContract = () => {
        // In a real app, this would involve selecting a template.
        // For now, we'll just add a placeholder contract to the list.
        const newFile: FileRecord = {
            id: `file-${Date.now()}`,
            name: 'Event Contract',
            type: 'contract',
            status: 'pending_signature',
            url: '/placeholder-contract.pdf',
        };
        setFiles([newFile]);
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
                                    <File className="h-6 w-6 text-muted-foreground" />
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
    const [files, setFiles] = useState<FileRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (initialEventData) {
            setEvent(initialEventData);
            // Simulate fetching files for the event
            if (initialEventData.status === 'booked' || initialEventData.status === 'completed') {
                setFiles([{ id: 'file-1', name: 'Event Contract', type: 'contract', status: 'signed', url: '/placeholder-contract.pdf' }]);
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
                <Card><CardHeader><CardTitle>Event Details</CardTitle></CardHeader><CardContent><p>Details about the event will be managed here.</p></CardContent></Card>
            </TabsContent>
            <TabsContent value="billing">
                <AdminBillingTab event={event} setEvent={setEvent} />
            </TabsContent>
            <TabsContent value="timeline"><Card><CardHeader><CardTitle>Event Timeline</CardTitle></CardHeader><CardContent><p>Admins can approve timeline items and sync them to Google Calendar.</p></CardContent></Card></TabsContent>
            <TabsContent value="files">
                <AdminFilesTab files={files} setFiles={setFiles} event={event} setEvent={setEvent} />
            </TabsContent>
            <TabsContent value="gallery"><Card><CardHeader><CardTitle>Gallery Settings</CardTitle></CardHeader><CardContent><p>Configure photo booth album URLs, QR code settings, and gallery visibility windows.</p></CardContent></Card></TabsContent>
            <TabsContent value="guest-qr"><Card><CardHeader><CardTitle>Guest Upload QR Code</CardTitle></CardHeader><CardContent><p>Generate and display the QR code for guest photo uploads.</p></CardContent></Card></TabsContent>
            <TabsContent value="music"><Card><CardHeader><CardTitle>Music Playlist</CardTitle></CardHeader><CardContent><p>Manage music requests and do-not-play lists.</p></CardContent></Card></TabsContent>
            <TabsContent value="communication"><Card><CardHeader><CardTitle>Communication</CardTitle></CardHeader><CardContent><p>A dedicated chat for this event between the admin and the host.</p></CardContent></Card></TabsContent>
            <TabsContent value="my-services"><Card><CardHeader><CardTitle>Requested Services</CardTitle></CardHeader><CardContent><p>Admin can approve additional service requests from the host. Approved services are then added to the invoice.</p></CardContent></Card></TabsContent>
        </EventProfileShell>
    );
}

    