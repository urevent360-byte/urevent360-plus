
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

function ActivationGate({ onActivate }: { onActivate: () => void }) {
    const { toast } = useToast();

    const handleSimulateAction = (action: 'Payment' | 'Signature') => {
        toast({
            title: `${action} Simulated`,
            description: `In a real app, this would redirect to a ${action.toLowerCase()} provider.`,
        });
        // In a real scenario, a webhook would trigger the activation.
        // Here, we'll just show a button to simulate completion.
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
                    <Button onClick={() => handleSimulateAction('Payment')} className="w-full">
                        View Invoice & Pay
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
                     <Button onClick={onActivate} variant="secondary">
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
  const eventData = use(getEvent(eventId));

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // We use local state to simulate the activation gate logic.
  // In a real app, the `event.status` from the database would control this.
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    if (eventData) {
        setEvent(eventData);
        // Simulate that a 'booked' event has already passed the activation gate.
        setIsActivated(eventData.status === 'booked');
        setIsLoading(false);
    }
  }, [eventData]);


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
    setIsActivated(true);
    setTimeout(() => setIsLoading(false), 500); // Simulate loading delay
  };

  return (
    <div>
        {isActivated ? (
            <EventProfileShell event={event} role="host">
                {/* Children for tab contents will go here */}
            </EventProfileShell>
        ) : (
            <ActivationGate onActivate={handleActivate} />
        )}
    </div>
  );
}
