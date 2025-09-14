
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Calendar, MapPin, FilePlus, Bot, Music, QrCode, GalleryHorizontal, ListTree, CreditCard, Files, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';

// Placeholder data - in a real app, this would be fetched for the eventId
const eventData = {
    clientName: 'John Doe',
    clientEmail: 'client@urevent360.com',
    eventName: "John's Quinceañera",
    eventDate: '2024-08-25',
    location: 'The Grand Ballroom, Orlando, FL',
    status: 'Booked',
    photoBoothAlbumUrl: 'https://photos.app.goo.gl/sample1',
};


export default function AdminEventDetailPage() {
    const params = useParams();
    const { eventId } = params;

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <Button variant="outline" asChild>
                    <Link href="/admin/events">
                        <ArrowLeft className="mr-2" />
                        Back to All Events
                    </Link>
                </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                <div className="lg:col-span-1 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Project Overview</CardTitle>
                            <CardDescription>Event ID: {eventId}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                             <div className="flex items-center gap-3">
                                <User className="text-muted-foreground" /> <span>{eventData.clientName} ({eventData.clientEmail})</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="text-muted-foreground" /> <span>{eventData.eventName} on {eventData.eventDate}</span>
                            </div>
                             <div className="flex items-center gap-3">
                                <MapPin className="text-muted-foreground" /> <span>{eventData.location}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                     <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9 mb-4">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="billing">Billing</TabsTrigger>
                            <TabsTrigger value="timeline">Timeline</TabsTrigger>
                            <TabsTrigger value="files">Files</TabsTrigger>
                            <TabsTrigger value="gallery">Gallery</TabsTrigger>
                            <TabsTrigger value="guest-qr">Guest QR</TabsTrigger>
                            <TabsTrigger value="music">Music</TabsTrigger>
                            <TabsTrigger value="chat">Chat</TabsTrigger>
                            <TabsTrigger value="services">Services</TabsTrigger>
                        </TabsList>
                        <Card>
                            <TabsContent value="details" className="p-6">
                                <CardTitle className="flex items-center gap-2 mb-4"><ListTree /> Event Details</CardTitle>
                                <p className="text-muted-foreground">This section contains editable details about the event.</p>
                            </TabsContent>
                            <TabsContent value="billing" className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                     <CardTitle className="flex items-center gap-2"><CreditCard /> Billing</CardTitle>
                                     <Button variant="outline"><FilePlus className="mr-2"/> Create Invoice</Button>
                                </div>
                                <p className="text-muted-foreground">Admin controls to generate and update QuickBooks invoices. The generated invoice and payment link will appear here and for the host.</p>
                            </TabsContent>
                             <TabsContent value="timeline" className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <CardTitle className="flex items-center gap-2"><ListTree /> Event Timeline</CardTitle>
                                    <Button variant="outline">Publish to Google Calendar</Button>
                                </div>
                                <p className="text-muted-foreground">Admin approves or modifies timeline items requested by the host and can sync approved items to a shared Google Calendar.</p>
                            </TabsContent>
                             <TabsContent value="files" className="p-6">
                                <CardTitle className="flex items-center gap-2 mb-4"><Files /> Files & Uploads</CardTitle>
                                <p className="text-muted-foreground">Admin uploads the contract and invoices. Signed documents from the host will appear here.</p>
                            </TabsContent>
                             <TabsContent value="gallery" className="p-6">
                                 <CardTitle className="flex items-center gap-2 mb-4"><GalleryHorizontal /> Gallery Settings</CardTitle>
                                 <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="photobooth-link">Photo Booth Album URL</Label>
                                        <Input id="photobooth-link" defaultValue={eventData.photoBoothAlbumUrl} />
                                        <p className="text-xs text-muted-foreground mt-1">The public URL for the professional photo booth album (e.g., Google Photos).</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Gallery Visibility Date</Label>
                                            <DatePicker date={new Date()} onDateChange={() => {}} />
                                        </div>
                                         <div>
                                            <Label>Guest Uploads Purge Date</Label>
                                            <DatePicker date={new Date(new Date().setDate(new Date().getDate() + 30))} onDateChange={() => {}} />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button>Save Gallery Settings</Button>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="guest-qr" className="p-6">
                                <CardTitle className="flex items-center gap-2 mb-4"><QrCode /> Guest Upload QR Manager</CardTitle>
                                <p className="text-muted-foreground">Admin manages the QR code for guest uploads, including regenerating, setting expiration, and usage limits.</p>
                            </TabsContent>
                             <TabsContent value="music" className="p-6">
                                <CardTitle className="flex items-center gap-2 mb-4"><Music /> Music Preferences</CardTitle>
                                <p className="text-muted-foreground">Admin reviews the "Must Play" and "Do Not Play" lists submitted by the host.</p>
                            </TabsContent>
                             <TabsContent value="chat" className="p-6">
                                <CardTitle className="flex items-center gap-2 mb-4"><Bot /> Communication</CardTitle>
                                <p className="text-muted-foreground">A shared chat thread between the admin and the host for this specific event.</p>
                            </TabsContent>
                             <TabsContent value="services" className="p-6">
                                <CardTitle className="flex items-center gap-2 mb-4"><Briefcase /> My Services</CardTitle>
                                <p className="text-muted-foreground">Admin views selected services and approves/rejects add-on requests from the host. Approved items can be added to the next invoice.</p>
                            </TabsContent>
                        </Card>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

