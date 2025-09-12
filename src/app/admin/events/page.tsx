'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { PartyPopper, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type Status = 'confirmed' | 'completed';

const placeholderEvents = [
    {
        id: 'event1',
        clientName: 'John Doe',
        serviceName: '360 Photo Booth',
        eventDate: new Date('2024-08-25T18:00:00'),
        status: 'confirmed' as Status
    },
    {
        id: 'event2',
        clientName: 'David Lee',
        serviceName: 'Magic Mirror',
        eventDate: new Date('2024-07-20T18:00:00'),
        status: 'completed' as Status
    },
     {
        id: 'event3',
        clientName: 'John Doe',
        serviceName: 'Cold Sparklers',
        eventDate: new Date('2024-08-25T21:00:00'),
        status: 'confirmed' as Status
    },
];

const statusDetails: Record<Status, {
    label: { en: string; es: string };
    icon: JSX.Element;
    badge: string;
    calendar: string;
}> = {
    confirmed: {
        label: { en: 'Confirmed', es: 'Confirmado' },
        icon: <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />,
        badge: 'bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30',
        calendar: 'bg-green-500/30 text-green-700'
    },
    completed: {
        label: { en: 'Completed', es: 'Completado' },
        icon: <PartyPopper className="mr-2 h-4 w-4 text-blue-500" />,
        badge: 'bg-blue-500/20 text-blue-700 border-blue-500/30 hover:bg-blue-500/30',
        calendar: 'bg-blue-500/30 text-blue-700'
    },
};

export default function EventsPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    
    const upcomingEvents = placeholderEvents.filter(b => b.status === 'confirmed');
    const pastEvents = placeholderEvents.filter(b => b.status === 'completed');

    const EventList = ({ title, events }: { title: string, events: typeof placeholderEvents }) => (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
            {events.length > 0 ? (
                 <div className="space-y-4">
                    {events.map(event => (
                        <Card key={event.id}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold">{event.serviceName}</h3>
                                    <p className="text-sm text-muted-foreground">{event.clientName} - {format(event.eventDate, 'PPP p')}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                     <Badge variant="outline" className={`flex items-center ${statusDetails[event.status].badge}`}>
                                        {statusDetails[event.status].icon}
                                        {statusDetails[event.status].label['en']}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>View Event Details</DropdownMenuItem>
                                            <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">No events in this category.</p>
            )}
            </CardContent>
        </Card>
    );
    
    const getEventDates = (status: Status) => placeholderEvents.filter(b => b.status === status).map(b => b.eventDate);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
                    <p className="text-muted-foreground">View and manage all confirmed and completed events.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                   <EventList title="Upcoming Events" events={upcomingEvents} />
                   <EventList title="Past Events" events={pastEvents} />
                </div>
                <div className="lg:col-span-1">
                     <Card>
                        <CardContent className="p-2">
                             <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md"
                                modifiers={{
                                    confirmed: getEventDates('confirmed'),
                                    completed: getEventDates('completed'),
                                }}
                                modifiersClassNames={{
                                    confirmed: `font-bold ${statusDetails.confirmed.calendar} rounded-md`,
                                    completed: `font-bold ${statusDetails.completed.calendar} rounded-md`,
                                }}
                            />
                        </CardContent>
                    </Card>
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Legend</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                           {Object.entries(statusDetails).map(([status, details]) => (
                               <div key={status} className="flex items-center">
                                   <span className={`w-4 h-4 rounded-full mr-2 ${details.calendar}`} />
                                   <span>{details.label['en']}</span>
                               </div>
                           ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
