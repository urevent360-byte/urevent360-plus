
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, GalleryHorizontal, ListMusic, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthProvider';

// Placeholder data - in a real app, this would be fetched
const upcomingEvent = {
    serviceName: '360 Photo Booth & Cold Sparklers',
    date: 'August 25, 2024',
    location: 'The Grand Ballroom, Orlando, FL'
};

const paymentStatus = {
    total: 2500,
    paid: 1250,
    due: 1250
};

export default function ClientDashboardPage() {
    const { user } = useAuth();
    
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.displayName || 'Client'}!</h1>
                    <p className="text-muted-foreground">Here's a snapshot of your upcoming event with us.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Your Upcoming Event</CardTitle>
                             <CardDescription>{upcomingEvent.date} at {upcomingEvent.location}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg text-primary">{upcomingEvent.serviceName}</h3>
                            <p className="text-muted-foreground mt-2">
                                We are getting everything ready to make your event spectacular. You can manage your event details using the links below.
                            </p>
                             <Button asChild className="mt-4">
                                <Link href="/dashboard/bookings">
                                    View Booking Details <ArrowRight className="ml-2"/>
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
               </div>

                <div className="space-y-6">
                    <Card>
                         <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                           <Button asChild variant="outline"><Link href="/dashboard/gallery"><GalleryHorizontal className="mr-2"/> View Gallery</Link></Button>
                           <Button asChild variant="outline"><Link href="/dashboard/music"><ListMusic className="mr-2"/> Music Choices</Link></Button>
                           <Button asChild variant="outline"><Link href="/dashboard/payments"><CreditCard className="mr-2"/> View Payments</Link></Button>
                           <Button asChild variant="outline"><Link href="/dashboard/bookings"><Calendar className="mr-2"/> Event Details</Link></Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

             <div className="mt-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Important Reminders</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ul className="space-y-3 list-disc list-inside text-muted-foreground">
                            <li>Final payment of ${paymentStatus.due} is due by August 1, 2024.</li>
                            <li>Submit your music playlist by August 15, 2024.</li>
                            <li>Your photo gallery will become available on August 26, 2024.</li>
                        </ul>
                    </CardContent>
                </Card>
             </div>
        </div>
    );
}

