
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, User, Calendar, MapPin, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Placeholder data - in a real app, this would be fetched for the leadId
const leadData = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    eventDate: '2024-10-15',
    eventType: 'Corporate Gala',
    location: 'Miami, FL',
    requestedServices: [
        { id: 'magic-mirror', name: 'Magic Mirror', quantity: 1, price: 0 },
        { id: 'led-screens-wall', name: 'LED Screens Wall', quantity: 1, price: 0 },
    ]
}


export default function LeadDetailPage() {
    const params = useParams();
    const { leadId } = params;

    return (
        <div>
            <div className="mb-8">
                <Button variant="outline" asChild>
                    <Link href="/admin/crm">
                        <ArrowLeft className="mr-2" />
                        Back to Leads
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Quote Builder</CardTitle>
                            <CardDescription>
                                Add services and set pricing to generate a quote for this lead.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {leadData.requestedServices.map(service => (
                                <div key={service.id} className="grid grid-cols-5 gap-4 items-center p-2 border rounded-md">
                                    <div className="col-span-2 font-medium">{service.name}</div>
                                    <div className="col-span-1">x {service.quantity}</div>
                                    <div className="col-span-2">
                                        <Label htmlFor={`price-${service.id}`} className="sr-only">Price</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                            <input
                                                id={`price-${service.id}`}
                                                type="number"
                                                defaultValue={service.price}
                                                className="w-full pl-7 p-2 border rounded-md"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4">
                                <Label htmlFor="notes">Internal Notes</Label>
                                <Textarea id="notes" placeholder="Add any internal notes about this quote..." />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                 <Button variant="outline"><FileText className="mr-2" /> Send Quote</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lead Overview</CardTitle>
                            <CardDescription>
                                Lead ID: {leadId}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center gap-3">
                                <User className="text-muted-foreground" /> <span>{leadData.name} ({leadData.email})</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="text-muted-foreground" /> <span>{leadData.eventType} on {leadData.eventDate}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="text-muted-foreground" /> <span>{leadData.location}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Button><Wand2 className="mr-2" /> Convert to Project</Button>
                            <Button variant="outline">Mark as Accepted</Button>
                            <Button variant="destructive" className="mt-4">Mark as Rejected</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
