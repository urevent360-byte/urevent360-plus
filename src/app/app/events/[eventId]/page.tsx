
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, DollarSign, CheckCircle, Bot, Music, QrCode, GalleryHorizontal, ListTree, CreditCard, Files, Briefcase, User, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


type EventStatus = 'Pending Activation' | 'Booked' | 'Completed';

// Placeholder data, would be fetched from Firestore
const eventData = {
    clientName: 'John Doe',
    clientEmail: 'client@urevent360.com',
    eventName: "John's Quinceañera",
    eventDate: '2024-08-25',
    location: 'The Grand Ballroom, Orlando, FL',
};

const statusDetails: Record<EventStatus, {
    label: string;
    badgeClass: string;
}> = {
    'Pending Activation': {
        label: 'Pending Activation',
        badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    'Booked': {
        label: 'Booked',
        badgeClass: 'bg-green-100 text-green-800 border-green-300',
    },
    'Completed': {
        label: 'Completed',
        badgeClass: 'bg-gray-100 text-gray-800 border-gray-300',
    }
};

// --- Gated View Component ---
function ActivationGate({ onActivate }: { onActivate: () => void }) {
    const { toast } = useToast();
    const [contractSigned, setContractSigned] = useState(false);
    const [depositPaid, setDepositPaid] = useState(false);

    const handleSignContract = () => {
        // Simulates opening an e-sign tool and getting a webhook callback
        toast({ title: "Contract 'Signed'!", description: "In a real app, this would use an e-sign service." });
        setContractSigned(true);
        if (depositPaid) onActivate();
    };

    const handlePayDeposit = () => {
        // Simulates redirecting to QuickBooks and getting a webhook callback
        toast({ title: "Deposit 'Paid'!", description: "In a real app, this would use a payment provider." });
        setDepositPaid(true);
        if (contractSigned) onActivate();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Complete Your Booking</CardTitle>
                <CardDescription>Please complete the following steps to activate your event portal.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className={contractSigned ? 'border-green-500' : ''}>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Step 1: Sign Contract
                            {contractSigned && <CheckCircle className="text-green-500" />}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">Review and sign your event contract to proceed.</p>
                        <Button onClick={handleSignContract} disabled={contractSigned} className="w-full">
                            <FileText className="mr-2" /> {contractSigned ? 'Contract Signed' : 'View & Sign Contract'}
                        </Button>
                    </CardContent>
                </Card>
                 <Card className={depositPaid ? 'border-green-500' : ''}>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Step 2: Pay Deposit
                             {depositPaid && <CheckCircle className="text-green-500" />}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">Pay the initial deposit to secure your event date.</p>
                        <Button onClick={handlePayDeposit} disabled={depositPaid} className="w-full">
                            <DollarSign className="mr-2" /> {depositPaid ? 'Deposit Paid' : 'Pay Deposit Now'}
                        </Button>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}


// --- Full Profile View Component ---
function EventProfile() {
    const params = useParams();
    const { eventId } = params;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <div className="lg:col-span-1 space-y-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>My Event</CardTitle>
                         <div className="flex justify-between items-center pt-1">
                            <CardDescription>Event ID: {eventId}</CardDescription>
                            <Badge variant="outline" className={statusDetails['Booked'].badgeClass}>
                                {statusDetails['Booked'].label}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                         <div className="flex items-center gap-3">
                            <User className="text-muted-foreground" /> <span>{eventData.clientName} ({eventData.clientEmail})</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CalendarIcon className="text-muted-foreground" /> <span>{eventData.eventName} on {eventData.eventDate}</span>
                        </div>
                         <div className="flex items-center gap-3">
                            <MapPin className="text-muted-foreground" /> <span>{eventData.location}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-3">
                 <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-8 mb-4">
                        <TabsTrigger value="details">Details</TabsTrigger>
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
                            <p className="text-muted-foreground">This section shows event details. Host can request changes.</p>
                        </TabsContent>
                         <TabsContent value="timeline" className="p-6">
                            <CardTitle className="flex items-center gap-2 mb-4"><ListTree /> Event Timeline</CardTitle>
                            <p className="text-muted-foreground">Host can request timeline changes to be approved by an admin.</p>
                        </TabsContent>
                         <TabsContent value="files" className="p-6">
                            <CardTitle className="flex items-center gap-2 mb-4"><Files /> Files & Uploads</CardTitle>
                            <p className="text-muted-foreground">View contracts and invoices. Upload your own files (e.g., audio).</p>
                        </TabsContent>
                         <TabsContent value="gallery" className="p-6">
                             <CardTitle className="flex items-center gap-2 mb-4"><GalleryHorizontal /> My Gallery</CardTitle>
                             <p className="text-muted-foreground">View the official Photo Booth album and guest-uploaded photos here after the event.</p>
                        </TabsContent>
                        <TabsContent value="guest-qr" className="p-6">
                            <CardTitle className="flex items-center gap-2 mb-4"><QrCode /> Guest Upload QR</CardTitle>
                            <p className="text-muted-foreground">Download and share the QR code for guests to upload their photos.</p>
                        </TabsContent>
                         <TabsContent value="music" className="p-6">
                            <CardTitle className="flex items-center gap-2 mb-4"><Music /> Music Preferences</CardTitle>
                            <p className="text-muted-foreground">Submit your "Must Play" and "Do Not Play" song lists for the DJ.</p>
                        </TabsContent>
                         <TabsContent value="chat" className="p-6">
                            <CardTitle className="flex items-center gap-2 mb-4"><Bot /> Communication</CardTitle>
                            <p className="text-muted-foreground">A shared chat thread with your event manager.</p>
                        </TabsContent>
                         <TabsContent value="services" className="p-6">
                            <CardTitle className="flex items-center gap-2 mb-4"><Briefcase /> My Services</CardTitle>
                            <p className="text-muted-foreground">View your selected services and request add-ons.</p>
                        </TabsContent>
                    </Card>
                </Tabs>
            </div>
        </div>
    );
}


export default function AppEventDetailPage() {
    const [status, setStatus] = useState<EventStatus>('Pending Activation');
    const { toast } = useToast();

    const handleActivation = () => {
        // This simulates the successful webhooks for payment and signature
        setStatus('Booked');
        toast({
            title: "Portal Activated!",
            description: "Your event is now booked. Welcome to your event portal!",
            className: "bg-green-500 text-white",
        });
    };

    return (
        <div>
            <div className="mb-8">
                <Button variant="outline" asChild>
                    <Link href="/app/my-events">
                        <ArrowLeft className="mr-2" />
                        Back to My Events
                    </Link>
                </Button>
            </div>
            
            {status !== 'Booked' && status !== 'Completed' ? (
                <ActivationGate onActivate={handleActivation} />
            ) : (
                <EventProfile />
            )}

        </div>
    );
}
