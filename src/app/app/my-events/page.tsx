
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Clock, FileSignature, DollarSign, PartyPopper } from 'lucide-react';
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
        icon: <FileSignature className="h-4 w-4" />,
        badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
    },
    'Deposit Due': {
        label: 'Deposit Due',
        icon: <DollarSign className="h-4 w-4" />,
        badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    'Booked': {
        label: 'Booked',
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        badgeClass: 'bg-green-100 text-green-800 border-green-300',
    },
    'Completed': {
        label: 'Completed',
        icon: <PartyPopper className="h-4 w-4" />,
        badgeClass: 'bg-gray-100 text-gray-800 border-gray-300',
    }
};

export default function AppMyEventsPage() {
    const statusCounts = placeholderEvents.reduce((acc, event) => {
        acc[event.status] = (acc[event.status] || 0) + 1;
        return acc;
    }, {} as Record<EventStatus, number>);
    
    const pendingActionsCount = (statusCounts['Pending Signature'] || 0) + (statusCounts['Deposit Due'] || 0);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
                    <p className="text-muted-foreground">An overview of your upcoming and past events with us.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                        <CheckCircle className="h-5 w-5 text-muted-foreground text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statusCounts['Booked'] || 0}</div>
                        <p className="text-xs text-muted-foreground">Events that are confirmed and ready.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending Action</CardTitle>
                        <Clock className="h-5 w-5 text-muted-foreground text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingActionsCount}</div>
                        <p className="text-xs text-muted-foreground">Events needing signature or deposit.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Completed Events</CardTitle>
                        <PartyPopper className="h-5 w-5 text-muted-foreground text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statusCounts['Completed'] || 0}</div>
                        <p className="text-xs text-muted-foreground">Past events you can look back on.</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                    <CardDescription>Click on any event to manage its details.</CardDescription>
                </CardHeader>
                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        Manage Event <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
