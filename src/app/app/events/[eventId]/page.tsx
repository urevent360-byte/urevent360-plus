
'use client';

import { getEvent } from '@/lib/data-adapter';
import { notFound, useParams } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { EventProfileShell } from '@/components/shared/EventProfileShell';
import type { Event } from '@/lib/data-adapter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CreditCard, Lock, PartyPopper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';

function ActivationGate({ event, onActivate }: { event: Event; onActivate: () => void }) {
    const { toast } = useToast();

    const handleSimulateAction = (action: 'Payment' | 'Signature') => {
        if (action === 'Payment' && event.status !== 'invoice_sent') {
            toast({
                title: 'Invoice Not Ready',
                description: 'The admin has not sent the invoice yet.',
                variant: 'destructive',
            });
            return;
        }

        toast({
            title: `${action} Simulated`,
            description: `In a real app, this would redirect to a ${action.toLowerCase()} provider.`,
        });
    };
    
    // Simulates receiving both webhooks
    const handleSimulateCompletion = () => {
        if (event.status !== 'invoice_sent') {
             toast({
                title: 'Cannot Activate Yet',
                description: 'The invoice must be sent before you can simulate completion.',
                variant: 'destructive',
            });
            return;
        }
        onActivate();
    };

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
                    <Button onClick={() => handleSimulateAction('Payment')} className="w-full" disabled={event.status !== 'invoice_sent'}>
                        {event.status === 'invoice_sent' ? 'View Invoice & Pay' : 'Awaiting Invoice'}
                    </Button>
                </Card>
                <Card className="p-6 flex flex-col items-center text-center">
                    <FileText className="h-8 w-8 mb-3 text-primary" />
                    <h3 className="font-semibold text-lg">Step 2: Sign Contract</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">Review and e-sign the event contract to finalize the agreement.</p>
                    <Button onClick={() => handleSimulateAction('Signature')} className="w-full">
                         Review & Sign Contract
                    </Button>
                </Card>
                <div className="md:col-span-2 text-center mt-4">
                     <Button onClick={handleSimulateCompletion} variant="secondary" disabled={event.status !== 'invoice_sent'}>
                        <PartyPopper className="mr-2" />
                        Simulate Completion & Unlock Portal
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                        (This is a developer shortcut. In production, this happens automatically after payment and signature.)
                    </p>
                </div>
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

// Main Page Component
export default function AppEventDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const initialEventData = use(getEvent(eventId));

  const [event, setEvent] = useState<Event | null>(initialEventData || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialEventData) {
        setEvent(initialEventData);
        setIsLoading(false);
    }
  }, [initialEventData]);


  if (isLoading) {
    return <EventProfileLoader />;
  }

  if (!event) {
    notFound();
  }

  const handleActivate = () => {
    setIsLoading(true);
    // Simulate the state change that would happen after webhooks are received.
    setEvent(prev => prev ? { ...prev, status: 'booked' } : null);
    setTimeout(() => setIsLoading(false), 500); // Simulate loading delay
  };

  const isActivated = event.status === 'booked';

  return (
    <div>
        {isActivated ? (
            <EventProfileShell event={event} role="host">
                <TabsContent value="details"><Card><CardHeader><CardTitle>Event Details</CardTitle></CardHeader><CardContent><p>Details about the event will be managed here.</p></CardContent></Card></TabsContent>
                <TabsContent value="timeline"><Card><CardHeader><CardTitle>Event Timeline</CardTitle></CardHeader><CardContent><p>Review your event timeline here.</p></CardContent></Card></TabsContent>
                <TabsContent value="files"><Card><CardHeader><CardTitle>Your Files</CardTitle></CardHeader><CardContent><p>View your contracts and other important documents.</p></CardContent></Card></TabsContent>
                <TabsContent value="gallery"><Card><CardHeader><CardTitle>Gallery</CardTitle></CardHeader><CardContent><p>Access your event photo gallery here.</p></CardContent></Card></TabsContent>
                <TabsContent value="guest-qr"><Card><CardHeader><CardTitle>Guest Upload QR Code</CardTitle></CardHeader><CardContent><p>Share this QR code with your guests to allow them to upload photos.</p></CardContent></Card></TabsContent>
                <TabsContent value="music"><Card><CardHeader><CardTitle>Music Playlist</CardTitle></CardHeader><CardContent><p>Submit your music requests and do-not-play list.</p></CardContent></Card></TabsContent>
                <TabsContent value="communication"><Card><CardHeader><CardTitle>Communication</CardTitle></CardHeader><CardContent><p>Chat with us about your event.</p></CardContent></Card></TabsContent>
                <TabsContent value="my-services"><Card><CardHeader><CardTitle>My Services</CardTitle></CardHeader><CardContent><p>Review your booked services and request add-ons.</p></CardContent></Card></TabsContent>
            </EventProfileShell>
        ) : (
            <ActivationGate event={event} onActivate={handleActivate} />
        )}
    </div>
  );
}
