
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Clock, FileSignature, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

type EventStatus = 'Pending Signature' | 'Deposit Due' | 'Booked' | 'Completed';

type Event = {
    id: string;
    name: string;
    date: Date;
    status: EventStatus;
};

const placeholderEvents: Event[] = [
    { id: 'evt-john-doe-2024', name: "John's Quinceañera", date: new Date('2024-08-25'), status: 'Booked' },
    { id: 'evt-maria-garcia-2024', name: "Garcia Wedding", date: new Date('2024-09-15'), status: 'Deposit Due' },
    { id: 'evt-jane-smith-2024', name: "Smith & Co Product Launch", date: new Date('2024-10-01'), status: 'Pending Signature' },
    { id: 'evt-old-event-2023', name: "Past Birthday", date: new Date('2023-12-15'), status: 'Completed' },
];

const statusDetails: Record<EventStatus, {
    label: string;
    icon: JSX.Element;
    badgeClass: string;
}> = {
    'Pending Signature': {
        label: 'Pending Signature',
        icon: <FileSignature className="h-3 w-3" />,
        badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
    },
    'Deposit Due': {
        label: 'Deposit Due',
        icon: <DollarSign className="h-3 w-3" />,
        badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    'Booked': {
        label: 'Booked',
        icon: <CheckCircle className="h-3 w-3 text-green-600" />,
        badgeClass: 'bg-green-100 text-green-800 border-green-300',
    },
    'Completed': {
        label: 'Completed',
        icon: <Clock className="h-3 w-3" />,
        badgeClass: 'bg-gray-100 text-gray-800 border-gray-300',
    }
};

export default function AppMyEventsPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
                    <p className="text-muted-foreground">An overview of your upcoming and past events with us.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {placeholderEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>{event.name}</CardTitle>
                                <Badge variant="outline" className={`flex items-center w-fit gap-1 ${statusDetails[event.status].badgeClass}`}>
                                    {statusDetails[event.status].icon}
                                    {statusDetails[event.status].label}
                                </Badge>
                            </div>
                            <CardDescription>{format(event.date, 'PPPP')}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-end">
                            <Button asChild variant="outline">
                                <Link href={`/app/events/${event.id}`}>
                                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
