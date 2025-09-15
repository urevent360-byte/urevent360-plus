
'use client';

import { getEvent } from '@/lib/data-adapter';
import { notFound, useParams } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { EventProfileShell } from '@/components/shared/EventProfileShell';
import type { Event, FileRecord } from '@/lib/data-adapter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CreditCard, Lock, PartyPopper, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';

function ActivationGate({ event, onActivate, onSign }: { event: Event; onActivate: () => void; onSign: () => void; }) {
    const { toast } = useToast();
    const [hasPaid, setHasPaid] = useState(false);
    
    const contractSent = event.status === 'contract_sent' || event.status === 'invoice_sent';

    const handlePay = () => {
        if (event.status !== 'invoice_sent') {
            toast({
                title: 'Invoice Not Ready',
                description: 'The admin has not sent the invoice yet.',
                variant: 'destructive',
            });
            return;
        }
        toast({ title: 'Payment Simulated', description: 'Redirecting to payment provider...' });
        setHasPaid(true);
    };

    const handleSign = () => {
        if (!contractSent) {
             toast({ title: 'Contract not ready', description: 'Admin has not sent the contract yet.', variant: 'destructive' });
             return;
        }
        onSign(); // This will update the file status to "signed"
        toast({ title: 'Contract Signed!', description: 'Thank you for signing the contract.' });
    };

    useEffect(() => {
        if(hasPaid && event.status === 'invoice_sent' && event.contractSigned) {
            onActivate();
        }
    }, [hasPaid, event, onActivate]);

    return (
        <Card>
            <CardHeader className="text-center">
                <Lock className="mx-auto h-12 w-12 text-primary/50 mb-4" />
                <CardTitle className="text-2xl">Finalize Your Booking</CardTitle>
                <CardDescription>Complete these two steps to unlock your event portal.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <Card className="p-6 flex flex-col items-center text-center">
                    <CreditCard className="h-8 w-8 mb-3 text-primary" />
                    <h3 className="font-semibold text-lg">Step 1: Pay Deposit</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">Review your invoice and submit the deposit to secure your date.</p>
                    <Button onClick={handlePay} className="w-full" disabled={event.status !== 'invoice_sent' || hasPaid}>
                        {hasPaid ? 'Deposit Paid!' : (event.status === 'invoice_sent' ? 'View Invoice & Pay' : 'Awaiting Invoice')}
                    </Button>
                </Card>
                <Card className="p-6 flex flex-col items-center text-center">
                    <FileText className="h-8 w-8 mb-3 text-primary" />
                    <h3 className="font-semibold text-lg">Step 2: Sign Contract</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">Review and e-sign the event contract to finalize the agreement.</p>
                    <Button onClick={handleSign} className="w-full" disabled={!contractSent || event.contractSigned}>
                         {event.contractSigned ? 'Contract Signed!' : 'Review & Sign Contract'}
                    </Button>
                </Card>
                {(hasPaid && event.contractSigned) && (
                    <div className="md:col-span-2 text-center mt-4">
                        <Button onClick={onActivate}>
                            <PartyPopper className="mr-2" />
                            Access Your Portal
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function HostFilesTab({ files }: { files: FileRecord[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Files</CardTitle>
                <CardDescription>View your contracts and other important documents.</CardDescription>
            </CardHeader>
            <CardContent>
                {files.length === 0 ? (
                    <p className="text-muted-foreground">No files have been shared for this event yet.</p>
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
    )
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

// Main Page Component
export default function AppEventDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const initialEventData = use(getEvent(eventId));

  const [event, setEvent] = useState<Event | null>(initialEventData || null);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (initialEventData) {
        setEvent(initialEventData);
        // Simulate fetching files
        if (initialEventData.status === 'contract_sent' || initialEventData.status === 'invoice_sent') {
            setFiles([{ id: 'file-1', name: 'Event Contract', type: 'contract', status: 'pending_signature', url: '/placeholder-contract.pdf' }]);
        }
        setIsLoading(false);
    }
  }, [initialEventData]);

  const handleSignContract = () => {
    setFiles(prev => prev.map(f => f.type === 'contract' ? { ...f, status: 'signed' } : f));
    setEvent(prev => prev ? { ...prev, contractSigned: true } : null);
  };

  const handleActivate = () => {
    setIsLoading(true);
    setEvent(prev => prev ? { ...prev, status: 'booked' } : null);
    toast({
        title: "Portal Unlocked!",
        description: "Welcome to your event dashboard."
    })
    setTimeout(() => setIsLoading(false), 500); 
  };

  if (isLoading) {
    return <EventProfileLoader />;
  }

  if (!event) {
    notFound();
  }

  const isActivated = event.status === 'booked';

  return (
    <div>
        {isActivated ? (
            <EventProfileShell event={event} role="host">
                <TabsContent value="details"><Card><CardHeader><CardTitle>Event Details</CardTitle></CardHeader><CardContent><p>Details about the event will be managed here.</p></CardContent></Card></TabsContent>
                <TabsContent value="timeline"><Card><CardHeader><CardTitle>Event Timeline</CardTitle></CardHeader><CardContent><p>Review your event timeline here.</p></CardContent></Card></TabsContent>
                <TabsContent value="files"><HostFilesTab files={files} /></TabsContent>
                <TabsContent value="gallery"><Card><CardHeader><CardTitle>Gallery</CardTitle></CardHeader><CardContent><p>Access your event photo gallery here.</p></CardContent></Card></TabsContent>
                <TabsContent value="guest-qr"><Card><CardHeader><CardTitle>Guest Upload QR Code</CardTitle></CardHeader><CardContent><p>Share this QR code with your guests to allow them to upload photos.</p></CardContent></Card></TabsContent>
                <TabsContent value="music"><Card><CardHeader><CardTitle>Music Playlist</CardTitle></CardHeader><CardContent><p>Submit your music requests and do-not-play list.</p></CardContent></Card></TabsContent>
                <TabsContent value="communication"><Card><CardHeader><CardTitle>Communication</CardTitle></CardHeader><CardContent><p>Chat with us about your event.</p></CardContent></Card></TabsContent>
                <TabsContent value="my-services"><Card><CardHeader><CardTitle>My Services</CardTitle></CardHeader><CardContent><p>Review your booked services and request add-ons.</p></CardContent></Card></TabsContent>
            </EventProfileShell>
        ) : (
            <ActivationGate event={event} onActivate={handleActivate} onSign={handleSignContract} />
        )}
    </div>
  );
}

    