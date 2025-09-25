

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventProfileShell } from '@/components/shared/EventProfileShell';
import { getEvent, markContractSigned, listFiles, listTimeline, getMusicPlaylist, saveMusicPlaylist, createChangeRequest, listPayments } from '@/lib/data-adapter';
import type { Event, FileRecord, TimelineItem, Song, Payment } from '@/lib/data-adapter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { EventChat } from '@/components/shared/EventChat';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Lock, FileSignature, BadgeDollarSign, Loader2, File, Download, CheckCircle, Music, Plus, Ban, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { EventGallery } from '@/components/shared/EventGallery';
import { EventServices } from '@/components/shared/EventServices';

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

function MusicPreferences({ eventId }: { eventId: string }) {
    const [mustPlay, setMustPlay] = useState<Song[]>([]);
    const [doNotPlay, setDoNotPlay] = useState<Song[]>([]);
    const [newSongTitle, setNewSongTitle] = useState('');
    const [newSongArtist, setNewSongArtist] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchPlaylist() {
            const playlist = await getMusicPlaylist(eventId);
            if (playlist) {
                setMustPlay(playlist.mustPlay);
                setDoNotPlay(playlist.doNotPlay);
            }
        }
        fetchPlaylist();
    }, [eventId]);

    const handleAddSong = (list: 'mustPlay' | 'doNotPlay') => {
        if (!newSongTitle || !newSongArtist) {
            toast({ title: 'Missing Info', description: 'Please enter both song title and artist.', variant: 'destructive' });
            return;
        }
        const newSong: Song = { title: newSongTitle, artist: newSongArtist };
        if (list === 'mustPlay') {
            setMustPlay(prev => [...prev, newSong]);
        } else {
            setDoNotPlay(prev => [...prev, newSong]);
        }
        setNewSongTitle('');
        setNewSongArtist('');
    };

    const handleRemoveSong = (list: 'mustPlay' | 'doNotPlay', index: number) => {
        if (list === 'mustPlay') {
            setMustPlay(prev => prev.filter((_, i) => i !== index));
        } else {
            setDoNotPlay(prev => prev.filter((_, i) => i !== index));
        }
    };
    
    const handleSave = async () => {
        setIsSaving(true);
        await saveMusicPlaylist(eventId, { mustPlay, doNotPlay });
        setIsSaving(false);
        toast({ title: 'Playlist Saved!', description: 'Your music preferences have been updated.' });
    };

    const SongList = ({ title, songs, onRemove, icon }: { title: string, songs: Song[], onRemove: (index: number) => void, icon: React.ReactNode }) => (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">{icon} {title}</CardTitle>
            </CardHeader>
            <CardContent>
                {songs.length > 0 ? (
                    <ul className="space-y-2">
                        {songs.map((song, index) => (
                            <li key={index} className="flex items-center justify-between text-sm border-b pb-2">
                                <div>
                                    <p className="font-medium">{song.title}</p>
                                    <p className="text-muted-foreground italic">{song.artist}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemove(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-center text-muted-foreground py-4">This list is empty.</p>
                )}
            </CardContent>
        </Card>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Music Preferences</CardTitle>
                <CardDescription>Curate the soundtrack for your event. Add songs to your "Must-Play" and "Do-Not-Play" lists.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="border p-4 rounded-lg space-y-4">
                     <h3 className="font-semibold">Add a Song</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input 
                            placeholder="Song Title" 
                            value={newSongTitle} 
                            onChange={e => setNewSongTitle(e.target.value)}
                        />
                        <Input 
                            placeholder="Artist" 
                            value={newSongArtist} 
                            onChange={e => setNewSongArtist(e.target.value)}
                        />
                     </div>
                     <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleAddSong('mustPlay')}><Plus className="mr-2"/> Add to Must-Play</Button>
                        <Button variant="outline" onClick={() => handleAddSong('doNotPlay')}><Ban className="mr-2"/> Add to Do-Not-Play</Button>
                     </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SongList title="Must-Play" songs={mustPlay} onRemove={(index) => handleRemoveSong('mustPlay', index)} icon={<Music/>} />
                    <SongList title="Do-Not-Play" songs={doNotPlay} onRemove={(index) => handleRemoveSong('doNotPlay', index)} icon={<Ban/>} />
                </div>
            </CardContent>
            <CardContent>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 animate-spin"/> : null}
                    Save Music Preferences
                </Button>
            </CardContent>
        </Card>
    );
}

export default function AppEventDetailClient({ eventId }: { eventId: string }) {
    console.log('[RSC] Enter: AppEventDetailClient');
    const [event, setEvent] = useState<Event | null>(null);
    const [files, setFiles] = useState<FileRecord[]>([]);
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSigning, setIsSigning] = useState(false);
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'details');
    const { toast } = useToast();

    async function fetchEventData() {
        console.log('[RSC] Enter: fetchEventData (App)');
        setIsLoading(true);
        const [fetchedEvent, fetchedFiles, fetchedTimeline, fetchedPayments] = await Promise.all([
            getEvent(eventId),
            listFiles(eventId),
            listTimeline(eventId),
            listPayments(eventId),
        ]);
        setEvent(fetchedEvent || null);
        setFiles(fetchedFiles);
        setTimeline(fetchedTimeline);
        setPayments(fetchedPayments);
        setIsLoading(false);
        console.log('[RSC] Exit: fetchEventData (App)');
    }

    useEffect(() => {
        fetchEventData();
    }, [eventId]);
    
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
            await fetchEventData();
        } catch (error) {
            toast({ title: "Error", description: "Failed to sign contract.", variant: "destructive" });
        } finally {
            setIsSigning(false);
        }
    };
    
    const handlePayDeposit = async () => {
        const activeInvoice = payments.find(p => p.isActive);
        if (activeInvoice && activeInvoice.quickbooksUrl) {
            window.open(activeInvoice.quickbooksUrl, '_blank');
        } else {
            toast({
                title: "No Invoice Found",
                description: "There is no active invoice ready for payment. Please contact us.",
                variant: "destructive"
            });
        }
    };

    const handleRequestChange = async () => {
        if (!event) return;
        // In a real app, this would open a modal form.
        // For this simulation, we'll create a predefined change request.
        const proposedPatch = {
            timeWindow: '7 PM - 1 AM',
            notes: 'We need to extend the party by one hour.',
        };
        await createChangeRequest(eventId, proposedPatch);
        toast({
            title: 'Change Request Sent',
            description: 'Your request has been sent to the admin for review.',
        });
    };
    
    const activePayment = payments.find(p => p.isActive);

    if (isLoading) {
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

    if (isLocked && !['details', 'billing'].includes(activeTab)) {
        return (
             <EventProfileShell event={event} role="host" isLoading={false} activeTab={activeTab} onTabChange={setActiveTab} isLocked={isLocked}>
                 <ActivationGate 
                    onSign={handleSignContract}
                    onPay={handlePayDeposit}
                    signing={isSigning}
                    paying={false} // Placeholder
                    contractSigned={event.contractSigned}
                />
            </EventProfileShell>
        );
    }

    console.log('[RSC] Render: AppEventDetailClient Content');
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
                 {console.log('[RSC] Enter: App Details Tab')}
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Event Details</CardTitle>
                            <CardDescription>
                                Key information about your event. Contact us for any changes.
                            </CardDescription>
                        </div>
                        <Button variant="outline" onClick={handleRequestChange}>Request Edit</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            <div><strong>Event Type:</strong> {event.type}</div>
                            <div><strong>Guest Count:</strong> {event.guestCount}</div>
                            <div><strong>Time Window:</strong> {event.timeWindow}</div>
                            <div><strong>Time Zone:</strong> {event.timeZone}</div>
                            <div className="md:col-span-2"><strong>Venue:</strong> {event.venue.name}, {event.venue.address}</div>
                            <div className="md:col-span-2"><strong>On-site Contact:</strong> {event.onsiteContact.name} ({event.onsiteContact.phone})</div>
                        </div>
                    </CardContent>
                </Card>
                 {console.log('[RSC] Exit: App Details Tab')}
            </TabsContent>
             <TabsContent value="billing">
                 {console.log('[RSC] Enter: App Billing Tab')}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Billing & Payments</CardTitle>
                            <CardDescription>Review your invoices and payment history.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {activePayment ? (
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                    <div className="lg:col-span-3 space-y-4">
                                        <div className="flex justify-between items-center p-4 border rounded-lg">
                                            <span className="text-muted-foreground">Invoice Total</span>
                                            <span className="font-bold text-lg">${activePayment.total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 border rounded-lg text-green-600">
                                            <span className="">Amount Paid</span>
                                            <span className="font-bold text-lg">${activePayment.depositPaid.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 border rounded-lg font-semibold text-destructive">
                                            <span className="">Remaining Balance</span>
                                            <span className="font-bold text-lg">${activePayment.remaining.toFixed(2)}</span>
                                        </div>
                                        {activePayment.remaining > 0 && activePayment.quickbooksUrl && (
                                            <Button asChild className="w-full">
                                                <a href={activePayment.quickbooksUrl} target="_blank" rel="noopener noreferrer">
                                                    <BadgeDollarSign className="mr-2"/> Pay Remaining Balance
                                                </a>
                                            </Button>
                                        )}
                                        {activePayment.status === 'paid_in_full' && (
                                            <div className="text-center font-semibold text-green-600 p-4 border rounded-lg bg-green-50">
                                                <CheckCircle className="inline-block mr-2" />
                                                Paid in Full
                                            </div>
                                        )}
                                    </div>
                                    <div className="lg:col-span-2">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-base">Payment History</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Date</TableHead>
                                                            <TableHead className="text-right">Amount</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {activePayment.history && activePayment.history.length > 0 ? (
                                                            activePayment.history.map((item, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>{format(new Date(item.ts), 'PP')}</TableCell>
                                                                    <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan={2} className="text-center h-24">
                                                                    No payments made yet.
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground p-8">Waiting for invoice from our team.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                 {console.log('[RSC] Exit: App Billing Tab')}
            </TabsContent>
            <TabsContent value="timeline">
                 {console.log('[RSC] Enter: App Timeline Tab')}
                <Card>
                     <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>My Event Timeline</CardTitle>
                             <CardDescription>This is the official schedule. Please review and contact us for any changes.</CardDescription>
                        </div>
                        <Button variant="outline" onClick={handleRequestChange}>Request Time Change</Button>
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
                 {console.log('[RSC] Exit: App Timeline Tab')}
            </TabsContent>
             <TabsContent value="files">
                 {console.log('[RSC] Enter: App Files Tab')}
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
                 {console.log('[RSC] Exit: App Files Tab')}
            </TabsContent>
            <TabsContent value="gallery">
                 <EventGallery 
                    role="host"
                    event={event}
                    onLinkChange={fetchEventData}
                 />
            </TabsContent>
             <TabsContent value="music">
                 {console.log('[RSC] Enter: App Music Tab')}
                <MusicPreferences eventId={eventId} />
                 {console.log('[RSC] Exit: App Music Tab')}
            </TabsContent>
            <TabsContent value="communication">
                <EventChat eventId={eventId} role="host" />
            </TabsContent>
             <TabsContent value="my-services">
                <EventServices eventId={eventId} role="host" onDataChange={fetchEventData} />
            </TabsContent>
            {console.log('[RSC] Exit: AppEventDetailClient')}
        </EventProfileShell>
    );
}

    



