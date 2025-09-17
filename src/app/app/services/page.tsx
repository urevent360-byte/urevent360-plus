'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { listSelectedServices, listAddons, requestAddons, type Addon } from '@/lib/data-adapter';
import type { Event } from '@/lib/data-adapter';
import Image from 'next/image';
import { Check, PlusCircle, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthProvider';

const eventId = 'evt-456'; // Hardcoded for prototype

export default function AppServicesPage() {
    const [bookedServices, setBookedServices] = useState<any[]>([]);
    const [addons, setAddons] = useState<Addon[]>([]);
    const [cart, setCart] = useState<Addon[]>([]);
    const { toast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        async function fetchData() {
            if (!user) return;
            const [services, availableAddons] = await Promise.all([
                listSelectedServices(eventId),
                listAddons()
            ]);
            setBookedServices(services);
            setAddons(availableAddons);
        }
        fetchData();
    }, [user]);

    const handleAddToCart = (addon: Addon) => {
        setCart(prev => [...prev, addon]);
    };

    const handleRemoveFromCart = (addonId: string) => {
        setCart(prev => prev.filter(item => item.id !== addonId));
    };

    const handleSendRequest = async () => {
        if (cart.length === 0) return;
        await requestAddons(eventId, cart.map(item => item.name));
        toast({
            title: 'Request Sent!',
            description: 'Your request for additional services has been sent to the admin for approval.'
        });
        setCart([]);
    };
    
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
                        <CardDescription>These services are confirmed for your event.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {bookedServices.map(booking => (
                            <Card key={booking.id}>
                                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                                    <div className="md:col-span-2">
                                        <h3 className="font-semibold">{booking.name}</h3>
                                        <p className="text-sm text-muted-foreground">Status: <span className="font-medium">{booking.status}</span></p>
                                    </div>
                                    <div>
                                        <Badge variant={booking.status === 'Booked' ? 'default' : 'secondary'}>{booking.status}</Badge>
                                    </div>
                                    <div className="flex justify-start md:justify-end gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/app/events/${eventId}?tab=my-services`}>Manage Service</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                         {bookedServices.length === 0 && <p className="text-muted-foreground">You have no booked services for this event yet.</p>}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Request Add-ons</CardTitle>
                        <CardDescription>Enhance your event by requesting additional services. No charges will be made until you approve the updated quote.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {addons.map(addon => {
                            const isInCart = cart.some(item => item.id === addon.id);
                            return (
                                <Card key={addon.id} className="overflow-hidden">
                                    <div className="relative h-48 w-full">
                                        <Image src={addon.image} alt={addon.name} fill className="object-cover"/>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold">{addon.name}</h3>
                                        <p className="text-sm text-muted-foreground mt-1 h-10">{addon.description}</p>
                                        <Button 
                                            className="w-full mt-4" 
                                            variant={isInCart ? "outline" : "default"}
                                            onClick={() => isInCart ? handleRemoveFromCart(addon.id) : handleAddToCart(addon)}
                                        >
                                            {isInCart ? <><Check className="mr-2"/>Added</> : <><PlusCircle className="mr-2"/>Add to Request</>}
                                        </Button>
                                    </div>
                                </Card>
                            )
                        })}
                    </CardContent>
                    {cart.length > 0 && (
                        <CardFooter className="flex-col items-start gap-4 border-t pt-6">
                            <div>
                                <h4 className="font-semibold">Services to request:</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                    {cart.map(item => <li key={item.id}>{item.name}</li>)}
                                </ul>
                            </div>
                            <Button onClick={handleSendRequest}>
                                <ShoppingCart className="mr-2" />
                                Send Quote Request for {cart.length} item(s)
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
}
