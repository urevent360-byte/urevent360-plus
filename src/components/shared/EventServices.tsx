

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Service } from '@/app/admin/services/[serviceId]/actions';
import { RequestedService } from '@/lib/types';
import Image from 'next/image';
import { Check, PlusCircle, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthProvider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import servicesCatalog from '@/lib/services-catalog.json';


// Mock functions to replace data-adapter
async function listSelectedServices(eventId: string): Promise<any[]> { console.log(`MOCK: listSelectedServices ${eventId}`); return []; }
async function requestAddons(eventId: string, items: string[]) { console.log(`MOCK: requestAddons ${eventId}`, items); }
async function approveServiceRequest(eventId: string, requestId: string) { console.log(`MOCK: approveServiceRequest ${eventId}, ${requestId}`); }
async function listRequestedServices(eventId: string): Promise<RequestedService[]> { console.log(`MOCK: listRequestedServices ${eventId}`); return []; }


type EventServicesProps = {
    eventId: string;
    role: 'host' | 'admin';
    onDataChange?: () => void;
};

export function EventServices({ eventId, role, onDataChange }: EventServicesProps) {
    const [bookedServices, setBookedServices] = useState<RequestedService[]>([]);
    const [availableAddons, setAvailableAddons] = useState<Service[]>([]);
    const [requestedAddons, setRequestedAddons] = useState<RequestedService[]>([]);
    const [cart, setCart] = useState<Service[]>([]);
    const { toast } = useToast();
    const { user } = useAuth();

    const fetchData = async () => {
        if (!user || !eventId) return;
        
        const [allBooked, allRequests] = await Promise.all([
            listSelectedServices(eventId),
            listRequestedServices(eventId)
        ]);
        
        const bookedServiceIds = allBooked.map(s => s.serviceId);
        const requestedAddonIds = allRequests.map(r => r.serviceId);
        
        const unbookedAddons = servicesCatalog.services.filter(service => 
            service.active &&
            !bookedServiceIds.includes(service.id) && 
            !requestedAddonIds.includes(service.id)
        );

        setBookedServices(allBooked as any);
        setAvailableAddons(unbookedAddons);
        setRequestedAddons(allRequests as any);
    };

    useEffect(() => {
        fetchData();
    }, [user, eventId]);

    const handleAddToCart = (addon: Service) => {
        setCart(prev => [...prev, addon]);
    };

    const handleRemoveFromCart = (addonId: string) => {
        setCart(prev => prev.filter(item => item.id !== addonId));
    };

    const handleSendRequest = async () => {
        if (cart.length === 0) return;
        await requestAddons(eventId, cart.map(item => item.id));
        toast({
            title: 'Request Sent!',
            description: 'Your request for additional services has been sent to the admin for approval.'
        });
        setCart([]);
        fetchData();
        if (onDataChange) onDataChange();
    };
    
    const handleApproveRequest = async (requestId: string) => {
        await approveServiceRequest(eventId, requestId);
        toast({
            title: 'Service Approved!',
            description: 'The addon is now approved and can be added to an invoice.'
        });
        fetchData();
        if (onDataChange) onDataChange();
    };

    if (role === 'admin') {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Service & Add-on Management</CardTitle>
                    <CardDescription>Review and approve requested add-on services from the client.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Service Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookedServices.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell className="font-medium">{(req as any).serviceName}</TableCell>
                                    <TableCell>
                                        <Badge variant='default' className="capitalize bg-green-500">Booked</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="ghost">Manage</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {requestedAddons.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell className="font-medium">{(req as any).serviceName}</TableCell>
                                    <TableCell>
                                        <Badge variant={req.status === 'approved' ? 'default' : 'outline'} className="capitalize">{req.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {req.status === 'requested' && (
                                            <Button size="sm" onClick={() => handleApproveRequest(req.id)}>
                                                <Check className="mr-2" />
                                                Approve
                                            </Button>
                                        )}
                                         {req.status === 'approved' && (
                                            <Button size="sm" variant="secondary">
                                                Add to Invoice
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     {requestedAddons.length === 0 && bookedServices.length > 0 && <p className="text-center text-muted-foreground p-8">No add-on services have been requested for this event.</p>}
                     {requestedAddons.length === 0 && bookedServices.length === 0 && <p className="text-center text-muted-foreground p-8">No services booked or requested for this event.</p>}
                </CardContent>
            </Card>
        )
    }

    return (
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
                                <div className="md:col-span-3">
                                    <h3 className="font-semibold">{(booking as any).serviceName}</h3>
                                </div>
                                <div>
                                    <Badge variant={'default'} className="bg-green-500">Booked</Badge>
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
                    {availableAddons.map(addon => {
                        const isInCart = cart.some(item => item.id === addon.id);
                        return (
                            <Card key={addon.id} className="overflow-hidden">
                                <div className="relative h-48 w-full">
                                    <Image src={addon.heroImage} alt={addon.title} fill className="object-cover"/>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold">{addon.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 h-10">{addon.shortDescription}</p>
                                    <Button 
                                        className="w-full mt-4" 
                                        variant={isInCart ? "outline" : "default"}
                                        onClick={() => isInCart ? handleRemoveFromCart(addon.id) : handleAddToCart(addon)}
                                    >
                                        {isInCart ? <><Check className="mr-2"/>Added to Request</> : <><PlusCircle className="mr-2"/>Add to Request</>}
                                    </Button>
                                </div>
                            </Card>
                        )
                    })}
                     {availableAddons.length === 0 && (
                        <p className="text-muted-foreground col-span-full text-center py-8">All available services have been booked or requested.</p>
                     )}
                </CardContent>
                {cart.length > 0 && (
                    <CardFooter className="flex-col items-start gap-4 border-t pt-6">
                        <div>
                            <h4 className="font-semibold">Services to request:</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                                {cart.map(item => <li key={item.id}>{item.title}</li>)}
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
    );
}
