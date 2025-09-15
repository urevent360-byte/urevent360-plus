'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventProfileShell } from '@/components/shared/EventProfileShell';
import { getEvent, markContractSigned, listFiles, listTimeline } from '@/lib/data-adapter';
import type { Event, FileRecord, TimelineItem } from '@/lib/data-adapter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { EventChat } from '@/components/shared/EventChat';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Lock, FileSignature, BadgeDollarSign, Loader2, File, Download, CheckCircle, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

function ActivationGate({ onSign, onPay, signing, paying, contractSigned }: { onSign: () => void, onPay: () => void, signing: boolean, paying: boolean, contractSigned?: boolean }) {
    return (
        <Card>
            <CardHeader className="text-center">
                <Lock className="mx-auto h-12 w-12 text-primary mb-4" />
                <CardTitle>Your Portal is Almost Ready!</CardTitle>
                <CardDescription className="max-w-md mx-auto">
                    To unlock all features of your event portal, please complete the final steps: sign your contract and pay the deposit.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button onClick={onSign} disabled={signing || contractSigned}>
                    {signing ? <Loader2 className="mr-2 animate-spin"/> : <FileSignature className="mr-2"/>}
                    {contractSigned ? 'Contract Signed' : 'Sign Contract'}
                </Button>
                <Button onClick={onPay} disabled={paying}>
                     {paying ? <Loader2 className="mr-2 animate-spin"/> : <BadgeDollarSign className="mr-2"/>}
                    Pay Deposit Invoice
                </Button>
            </CardContent>
        </Card>
    );
}


function AppEventDetailClient({ eventId }: { eventId: string }) {
    const [event, setEvent] = useState<Event | null>(null);
    const [files, setFiles] = useState<FileRecord[]>([]);
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSigning, setIsSigning] = useState(false);
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'details');
    const { toast } = useToast();

    async function fetchEventData() {
        setIsLoading(true);
        const [fetchedEvent, fetchedFiles, fetchedTimeline] = await Promise.all([
            getEvent(eventId),
            listFiles(eventId),
            listTimeline(eventId)
        ]);
        setEvent(fetchedEvent || null);
        setFiles(fetchedFiles);
        setTimeline(fetchedTimeline);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchEventData();
    }, [eventId]);
    
    // The "booked" status unlocks the portal for the host.
    const isLocked = event?.status !== 'booked';

    const handleSignContract = async () => {
        if (!event) return;
        setIsSigning(true);
        try {
            await markContractSigned(event.id);
            toast({
                title: "Contract Signed!",
                description: "Thank you! Your portal will unlock once the deposit is paid.",
            });
            // Refetch data to update UI
            await fetchEventData();
        } catch (error) {
            toast({ title: "Error", description: "Failed to sign contract.", variant: "destructive" });
        } finally {
            setIsSigning(false);
        }
    };
    
    const handlePayDeposit = async () => {
        toast({
            title: "Simulating Payment...",
            description: "You are being redirected to a mock payment page.",
        });
        // In a real app, this would redirect to a payment gateway.
    };

    if (isLoading) {
        // Show a loading state while we fetch event data
        return (
             <EventProfileShell
                event={null}
                role="host"
                isLoading={true}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            >
                <p>Loading...</p>
             </EventProfileShell>
        );
    }
    
     if (!event) {
        return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>Event not found.</AlertDescription></Alert>;
    }

    if (isLocked) {
        return <ActivationGate 
            onSign={handleSignContract}
            onPay={handlePayDeposit}
            signing={isSigning}
            paying={false} // Placeholder
            contractSigned={event.contractSigned}
        />;
    }

    return (
        <EventProfileShell
            event={event}
            role="host"
            isLoading={isLoading}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isLocked={isLocked}
        >
             <TabsContent value="details">
                <Card>
                    <CardHeader><CardTitle>Event Details</CardTitle></CardHeader>
                    <CardContent>
                        <p>Hello, {event.clientName}! Here you can view the core details of your event.</p>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="timeline">
                <Card>
                     <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>My Event Timeline</CardTitle>
                             <CardDescription>This is the official schedule. Please review and contact us for any changes.</CardDescription>
                        </div>
                        <Button variant="outline">Request Time Change</Button>
                    </CardHeader>
                     <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-right">Synced to Calendar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {timeline.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-mono text-sm">
                                            {format(new Date(item.startTime), 'p')} - {format(new Date(item.endTime), 'p')}
                                        </TableCell>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell className="text-right">
                                            {item.isSyncedToGoogle && <CheckCircle className="inline-block text-green-500" size={16} />}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {timeline.length === 0 && <p className="text-center text-muted-foreground p-8">The event timeline has not been published yet.</p>}
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="files">
                 <Card>
                    <CardHeader>
                        <CardTitle>My Files</CardTitle>
                        <CardDescription>Download contracts, invoices, and other important documents.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {files.map(file => (
                                    <TableRow key={file.id}>
                                        <TableCell className="font-medium flex items-center gap-2"><File size={16} />{file.name}</TableCell>
                                        <TableCell><Badge variant="secondary">{file.type}</Badge></TableCell>
                                        <TableCell>{format(new Date(file.timestamp), 'PPp')}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon"><Download size={16} /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {files.length === 0 && <p className="text-center text-muted-foreground p-8">No files have been shared with you yet.</p>}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="gallery">
                <Card>
                    <CardHeader><CardTitle>My Photo Gallery</CardTitle></CardHeader>
                    <CardContent><p>TODO: Display photo booth link and guest uploads.</p></CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="music">
                <Card>
                    <CardHeader><CardTitle>My Music Playlist</CardTitle></CardHeader>
                    <CardContent><p>TODO: Build music preference lists (Must Play / Do Not Play).</p></CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="communication">
                <EventChat role="host" />
            </TabsContent>
             <TabsContent value="my-services">
                 <Card>
                    <CardHeader><CardTitle>My Services</CardTitle></CardHeader>
                    <CardContent><p>TODO: Show booked services and allow requesting add-ons.</p></CardContent>
                </Card>
            </TabsContent>
        </EventProfileShell>
    );
}


export default function AppEventDetailPage({ params }: { params: { eventId: string } }) {
  return <AppEventDetailClient eventId={params.eventId} />;
}
