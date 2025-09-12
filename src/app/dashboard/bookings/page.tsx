'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useLanguage } from '@/contexts/LanguageProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { PartyPopper, CheckCircle2, Clock } from 'lucide-react';

const placeholderBookings = [
    {
        id: 'booking1',
        serviceName: '360 Photo Booth',
        eventDate: new Date('2024-08-25T18:00:00'),
        status: 'confirmed' as const
    },
    {
        id: 'booking2',
        serviceName: 'La Hora Loca',
        eventDate: new Date('2024-09-15T20:00:00'),
        status: 'pending' as const
    },
     {
        id: 'booking3',
        serviceName: 'Magic Mirror',
        eventDate: new Date('2024-07-20T18:00:00'),
        status: 'completed' as const
    },
];

const statusDetails = {
    confirmed: {
        label: { en: 'Confirmed', es: 'Confirmado' },
        icon: <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />,
        badge: 'bg-green-500/20 text-green-700 border-green-500/30'
    },
    pending: {
        label: { en: 'Pending', es: 'Pendiente' },
        icon: <Clock className="mr-2 h-4 w-4 text-yellow-500" />,
        badge: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
    },
    completed: {
        label: { en: 'Completed', es: 'Completado' },
        icon: <PartyPopper className="mr-2 h-4 w-4 text-blue-500" />,
        badge: 'bg-blue-500/20 text-blue-700 border-blue-500/30'
    },
};

export default function BookingsPage() {
    const { language } = useLanguage();
    const [date, setDate] = useState<Date | undefined>(new Date());

    const t = {
        title: { en: 'My Bookings', es: 'Mis Reservas' },
        description: { en: 'View and manage your upcoming and past events.', es: 'Ver y gestionar tus eventos próximos y pasados.' },
        upcomingEvents: { en: 'Upcoming Events', es: 'Próximos Eventos' },
        pastEvents: { en: 'Past Events', es: 'Eventos Pasados' },
        viewDetails: { en: 'View Details', es: 'Ver Detalles' },
    };

    const upcomingBookings = placeholderBookings.filter(b => b.eventDate >= new Date() && b.status !== 'completed');
    const pastBookings = placeholderBookings.filter(b => b.eventDate < new Date() || b.status === 'completed');

    const BookingList = ({ title, bookings }: { title: string, bookings: typeof placeholderBookings }) => (
        <div>
            <h2 className="text-xl font-semibold tracking-tight mb-4">{title}</h2>
            {bookings.length > 0 ? (
                 <div className="space-y-4">
                    {bookings.map(booking => (
                        <Card key={booking.id}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold">{booking.serviceName}</h3>
                                    <p className="text-sm text-muted-foreground">{format(booking.eventDate, 'PPP p')}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                     <Badge variant="outline" className={`flex items-center ${statusDetails[booking.status].badge}`}>
                                        {statusDetails[booking.status].icon}
                                        {statusDetails[booking.status].label[language]}
                                    </Badge>
                                    <Button variant="outline" size="sm">{t.viewDetails[language]}</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">{language === 'en' ? 'No events in this category.' : 'No hay eventos en esta categoría.'}</p>
            )}
        </div>
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t.title[language]}</h1>
                    <p className="text-muted-foreground">{t.description[language]}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                   <BookingList title={t.upcomingEvents[language]} bookings={upcomingBookings} />
                   <BookingList title={t.pastEvents[language]} bookings={pastBookings} />
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
                                    event: placeholderBookings.map(b => b.eventDate)
                                }}
                                modifiersClassNames={{
                                    event: 'bg-primary/20 text-primary-foreground rounded-full'
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
