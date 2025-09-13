
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';

const placeholderBookings = [
    {
        id: 'booking1',
        serviceName: '360 Photo Booth',
        eventDate: new Date('2024-08-25T18:00:00'),
        status: 'Confirmed',
        invoiceId: 'INV-001'
    },
    {
        id: 'booking2',
        serviceName: 'Cold Sparklers',
        eventDate: new Date('2024-08-25T21:00:00'),
        status: 'Confirmed',
        invoiceId: 'INV-001'
    },
     {
        id: 'booking3',
        serviceName: 'Magic Mirror',
        eventDate: new Date('2024-06-15T19:00:00'),
        status: 'Completed',
        invoiceId: 'INV-000'
    },
];


export default function AppServicesPage() {
    
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Services & Bookings</h1>
                    <p className="text-muted-foreground">An overview of your confirmed and past services.</p>
                </div>
            </div>

            <div className="space-y-8">
               
                <Card>
                    <CardHeader>
                        <CardTitle>Your Booked Services</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {placeholderBookings.map(booking => (
                            <Card key={booking.id}>
                                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                                    <div className="md:col-span-2">
                                        <h3 className="font-semibold">{booking.serviceName}</h3>
                                        <p className="text-sm text-muted-foreground">{format(booking.eventDate, 'PPPP p')}</p>
                                    </div>
                                    <div>
                                         <Badge variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}>{booking.status}</Badge>
                                    </div>
                                    <div className="flex justify-start md:justify-end gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/app/timeline?event=${booking.id}`}>View Timeline</Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/app/payments?invoice=${booking.invoiceId}`}>View Invoice</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
                
            </div>
        </div>
    );
}
