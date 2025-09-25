
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { PartyPopper, CheckCircle2, MoreHorizontal, Clock, Hourglass, FileText, XCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type Status = 'booked' | 'completed' | 'quote_requested' | 'contract_sent' | 'invoice_sent' | 'deposit_due' | 'canceled';

const placeholderEvents = [
    {
        id: 'event1',
        clientName: 'John Doe',
        serviceName: '360 Photo Booth',
        eventDate: new Date('2024-08-25T18:00:00'),
        status: 'booked' as Status
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
        status: 'booked' as Status
    },
    {
        id: 'event4',
        clientName: 'New Client',
        serviceName: 'La Hora Loca',
        eventDate: new Date('2024-09-10T21:00:00'),
        status: 'quote_requested' as Status
    }
];

const statusDetails: Record<Status, {
    label: { en: string; es: string };
    icon: JSX.Element;
    badge: string;
    calendar: string;
}> = {
    quote_requested: {
        label: { en: 'Quote Requested', es: 'Cotización Solicitada' },
        icon: <FileText className="mr-2 h-4 w-4 text-gray-500" />,
        badge: 'bg-gray-500/20 text-gray-700 border-gray-500/30 hover:bg-gray-500/30',
        calendar: 'bg-gray-500/30 text-gray-700'
    },
    contract_sent: {
        label: { en: 'Contract Sent', es: 'Contrato Enviado' },
        icon: <FileText className="mr-2 h-4 w-4 text-yellow-500" />,
        badge: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30',
        calendar: 'bg-yellow-500/30 text-yellow-700'
    },
     invoice_sent: {
        label: { en: 'Invoice Sent', es: 'Factura Enviada' },
        icon: <FileText className="mr-2 h-4 w-4 text-orange-500" />,
        badge: 'bg-orange-500/20 text-orange-700 border-orange-500/30 hover:bg-orange-500/30',
        calendar: 'bg-orange-500/30 text-orange-700'
    },
    deposit_due: {
        label: { en: 'Deposit Due', es: 'Depósito Pendiente' },
        icon: <Hourglass className="mr-2 h-4 w-4 text-purple-500" />,
        badge: 'bg-purple-500/20 text-purple-700 border-purple-500/30 hover:bg-purple-500/30',
        calendar: 'bg-purple-500/30 text-purple-700'
    },
    booked: {
        label: { en: 'Booked', es: 'Reservado' },
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
    canceled: {
        label: { en: 'Canceled', es: 'Cancelado' },
        icon: <XCircle className="mr-2 h-4 w-4 text-red-500" />,
        badge: 'bg-red-500/20 text-red-700 border-red-500/30 hover:bg-red-500/30',
        calendar: 'bg-red-500/30 text-red-700'
    },
};

export default function CalendarPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [language, setLanguage] = useState<'en' | 'es'>('en');
    
    const upcomingEvents = placeholderEvents.filter(b => b.status !== 'completed');
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
                                        {statusDetails[event.status].label[language]}
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
                    <h1 className="text-3xl font-bold tracking-tight">Event Calendar</h1>
                    <p className="text-muted-foreground">View and manage all confirmed and completed events.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant={language === 'en' ? 'default' : 'outline'} onClick={() => setLanguage('en')}>EN</Button>
                    <Button variant={language === 'es' ? 'default' : 'outline'} onClick={() => setLanguage('es')}>ES</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                   <EventList title={language === 'en' ? "Upcoming Events" : "Eventos Próximos"} events={upcomingEvents} />
                   <EventList title={language === 'en' ? "Past Events" : "Eventos Pasados"} events={pastEvents} />
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
                                    booked: getEventDates('booked'),
                                    completed: getEventDates('completed'),
                                }}
                                modifiersClassNames={{
                                    booked: `font-bold ${statusDetails.booked.calendar} rounded-md`,
                                    completed: `font-bold ${statusDetails.completed.calendar} rounded-md`,
                                }}
                            />
                        </CardContent>
                    </Card>
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>{language === 'en' ? "Legend" : "Leyenda"}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                           {Object.entries(statusDetails).map(([status, details]) => (
                               <div key={status} className="flex items-center">
                                   <span className={`w-4 h-4 rounded-full mr-2 ${details.calendar}`} />
                                   <span>{details.label[language]}</span>
                               </div>
                           ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
