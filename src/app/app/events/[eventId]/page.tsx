
'use client';

import { getEvent } from '@/lib/data-adapter';
import { notFound, useParams } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { EventProfileShell } from '@/components/shared/EventProfileShell';
import type { Event, FileRecord } from '@/lib/data-adapter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CreditCard, Lock, PartyPopper, CheckCircle, ExternalLink, Circle, PlusCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { EventChat } from '@/components/shared/EventChat';

// MOCK DATA for Timeline - should be the same as admin view
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


function ActivationGate({ event, onActivate, onSign }: { event: Event; onActivate: () => void; onSign: () => void; }) {
    const { toast } = useToast();
    const [hasPaid, setHasPaid] = useState(false);
    
    const contractSent = event.status === 'contract_sent' || event.status === 'invoice_sent' || event.status === 'deposit_due' || event.status === 'booked';

    const handlePay = () => {
        if (event.status !== 'invoice_sent' && event.status !== 'deposit_due') {
            toast({
                title: 'Invoice Not Ready',
                description: 'The admin has not sent the invoice yet.',
                variant: 'destructive',
            });
            return;
        }
        toast({ title: 'Payment Simulated', description: 'Redirecting to payment provider...' });
        setTimeout(() => {
            setHasPaid(true);
            toast({ title: 'Deposit Paid!', description: 'Your deposit has been successfully processed.'});
        }, 1500);
    };

    const handleSign = () => {
        if (!contractSent) {
             toast({ title: 'Contract not ready', description: 'Admin has not sent the contract yet.', variant: 'destructive' });
             return;
        }
        onSign(); 
        toast({ title: 'Contract Signed!', description: 'Thank you for signing the contract.' });
    };

    useEffect(() => {
        if(hasPaid && event.contractSigned) {
            onActivate();
        }
    }, [hasPaid, event.contractSigned, onActivate]);

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
                    <Button onClick={handlePay} className="w-full" disabled={(event.status !== 'invoice_sent' && event.status !== 'deposit_due') || hasPaid}>
                        {hasPaid ? <><CheckCircle className="mr-2"/>Deposit Paid!</> : (event.status === 'invoice_sent' || event.status === 'deposit_due' ? 'View Invoice & Pay' : 'Awaiting Invoice')}
                    </Button>
                </Card>
                <Card className="p-6 flex flex-col items-center text-center">
                    <FileText className="h-8 w-8 mb-3 text-primary" />
                    <h3 className="font-semibold text-lg">Step 2: Sign Contract</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">Review and e-sign the event contract to finalize the agreement.</p>
                    <Button onClick={handleSign} className="w-full" disabled={!contractSent || event.contractSigned}>
                         {event.contractSigned ? <><CheckCircle className="mr-2"/>Contract Signed!</> : 'Review & Sign Contract'}
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

function HostTimelineTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Event Timeline</CardTitle>
                <CardDescription>Review the schedule for your event. Contact us for any changes.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {timelineItems.map(item => (
                         <Card key={item.id} className="p-4 flex items-center justify-between">
                            <div>
                                <span className="font-bold mr-4">{item.time}</span>
                                <span>{item.description}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                {item.status === 'approved' ? (
                                    <span className="text-green-600 flex items-center gap-1"><CheckCircle/>Approved</span>
                                ) : (
                                    <span className="text-yellow-600">Pending Approval</span>
                                )}
                                {item.synced && (
                                     <span className="text-blue-600 flex items-center gap-1"><Circle className="fill-blue-500 text-blue-500"/> On Calendar</span>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function HostServicesTab() {
    const { toast } = useToast();
    const [services, setServices] = useState(initialServices);

    const handleRequestAddon = (serviceName: string) => {
        if (!services.some(s => s.name === serviceName)) {
            setServices([...services, { name: serviceName, status: 'requested' }]);
            toast({
                title: 'Service Requested',
                description: `We've sent a request for ${serviceName} to the admin.`,
            });
        }
    };

    const currentAddons = services.map(s => s.name);
    const unrequestedAddons = availableAddons.filter(a => !currentAddons.includes(a));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <Card>
                <CardHeader>
                    <CardTitle>Your Services</CardTitle>
                    <CardDescription>The current services confirmed for your event.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {services.map(service => (
                            <Card key={service.name} className="p-4 flex items-center justify-between bg-muted/50">
                                <p className="font-medium">{service.name}</p>
                                <Badge variant={service.status === 'approved' ? 'default' : 'outline'} className="capitalize">
                                     {service.status === 'requested' && <Clock className="mr-1 h-3 w-3"/>}
                                    {service.status}
                                </Badge>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Request Add-ons</CardTitle>
                    <CardDescription>Enhance your event with more services.</CardDescription>
                </CardHeader>
                <CardContent>
                    {unrequestedAddons.length > 0 ? (
                        <div className="space-y-2">
                            {unrequestedAddons.map(addon => (
                                 <Card key={addon} className="p-3 flex items-center justify-between">
                                    <p className="font-medium text-sm">{addon}</p>
                                    <Button size="sm" variant="ghost" onClick={() => handleRequestAddon(addon)}>
                                        <PlusCircle className="mr-2"/> Request
                                    </Button>
                                 </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">You've requested all available add-ons.</p>
                    )}
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
        if (initialEventData.status === 'contract_sent' || initialEventData.status === 'invoice_sent' || initialEventData.status === 'deposit_due') {
            setFiles([{ id: 'file-1', name: 'Event Contract', type: 'contract', status: 'pending_signature', url: '/placeholder-contract.pdf' }]);
        } else if (initialEventData.status === 'booked' || initialEventData.status === 'completed') {
            setFiles([{ id: 'file-1', name: 'Event Contract', type: 'contract', status: 'signed', url: '/placeholder-contract.pdf' }]);
            setEvent(prev => prev ? { ...prev, contractSigned: true } : null);
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
    // This would typically be an API call to update the backend
    // For now, we simulate the state change and a webhook-like update
    setTimeout(() => {
        setEvent(prev => prev ? { ...prev, status: 'booked' } : null);
        toast({
            title: "Portal Unlocked!",
            description: "Welcome to your event dashboard."
        })
        setIsLoading(false); 
    }, 1000);
  };

  if (isLoading) {
    return <EventProfileLoader />;
  }

  if (!event) {
    notFound();
  }
  
  const isActivated = event.status === 'booked' || event.status === 'completed';

  return (
    <div>
        {isActivated ? (
            <EventProfileShell event={event} role="host">
                <TabsContent value="details"><Card><CardHeader><CardTitle>Event Details</CardTitle></CardHeader><CardContent><p>Review your event's core details here. Contact us for any changes.</p></CardContent></Card></TabsContent>
                <TabsContent value="timeline"><HostTimelineTab /></TabsContent>
                <TabsContent value="files"><HostFilesTab files={files} /></TabsContent>
                <TabsContent value="gallery"><Card><CardHeader><CardTitle>Gallery</CardTitle><CardDescription>Access your official photos and community uploads.</CardDescription></CardHeader><CardContent><p>Access your event photo gallery here once it becomes available after the event date.</p></CardContent></Card></TabsContent>
                <TabsContent value="music"><Card><CardHeader><CardTitle>Music Playlist</CardTitle><CardDescription>Submit your music preferences.</CardDescription></CardHeader><CardContent><p>Submit your music requests and do-not-play list for the DJ.</p></CardContent></Card></TabsContent>
                <TabsContent value="communication"><EventChat role="host" /></TabsContent>
                <TabsContent value="my-services"><HostServicesTab /></TabsContent>
            </EventProfileShell>
        ) : (
            <ActivationGate event={event} onActivate={handleActivate} onSign={handleSignContract} />
        )}
    </div>
  );
}
