
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, DollarSign } from 'lucide-react';
import { Event, Payment } from '@/lib/types';


export type EventWithPayments = Event & { activePayment?: Payment };

async function listHostEventsWithPayments(hostId: string): Promise<EventWithPayments[]> {
    console.log(`MOCK: listHostEventsWithPayments for ${hostId}`);
    return [];
}


const paymentStatusDetails: Record<string, { badgeClass: string; label: string }> = {
    unpaid: { badgeClass: 'bg-red-500/20 text-red-700 border-red-500/30', label: 'Unpaid' },
    deposit_paid: { badgeClass: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30', label: 'Deposit Paid' },
    paid_in_full: { badgeClass: 'bg-green-500/20 text-green-700 border-green-500/30', label: 'Paid in Full' },
    void: { badgeClass: 'bg-gray-500/20 text-gray-700 border-gray-500/30', label: 'Void' },
};

const getPaymentStatus = (payment?: any) => {
    if (!payment) return { badgeClass: 'bg-gray-100', label: 'No Invoice' };
    return paymentStatusDetails[payment.status] || { badgeClass: 'bg-gray-100', label: 'Unknown' };
};


export default function AppPaymentsPage() {
    const { user } = useAuth();
    const [eventsWithPayments, setEventsWithPayments] = useState<EventWithPayments[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchEventsAndPayments() {
            if (user?.uid) {
                setIsLoading(true);
                const data = await listHostEventsWithPayments(user.uid);
                setEventsWithPayments(data);
                setIsLoading(false);
            } else if (user) {
                 // Fallback for mock environment
                setIsLoading(true);
                const data = await listHostEventsWithPayments('user-davidlee');
                setEventsWithPayments(data);
                setIsLoading(false);
            }
        }
        fetchEventsAndPayments();
    }, [user]);

    if (isLoading) {
        return (
            <div>
                 <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                        <p className="text-muted-foreground">View your invoices and payment history.</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                    <p className="text-muted-foreground">View your invoices and payment history for all events.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>My Event Invoices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {eventsWithPayments.length > 0 ? (
                        eventsWithPayments.map((event: any) => {
                            const paymentStatus = getPaymentStatus(event.activePayment);
                            return (
                                <Card key={event.id}>
                                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                                        <div className="md:col-span-2">
                                            <h3 className="font-semibold">{event.eventName}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(event.eventDate), 'PPP')}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-start gap-1">
                                             <Badge variant="outline" className={paymentStatus.badgeClass}>
                                                {paymentStatus.label}
                                            </Badge>
                                             {event.activePayment && event.activePayment.remaining > 0 && (
                                                <p className="text-sm font-semibold">${event.activePayment.remaining.toFixed(2)} remaining</p>
                                            )}
                                        </div>
                                        <div className="flex justify-start md:justify-end">
                                            <Button asChild>
                                                <Link href={`/app/events/${event.id}?tab=billing`}>
                                                    <DollarSign className="mr-2" /> Open Billing
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })
                    ) : (
                         <div className="text-center text-muted-foreground py-12">
                            <p>You have no events with active or past payments.</p>
                         </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
