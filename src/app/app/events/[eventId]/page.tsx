

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventProfileShell } from '@/components/shared/EventProfileShell';
import { getEvent, markContractSigned, listFiles, listTimeline, getMusicPlaylist, saveMusicPlaylist } from '@/lib/data-adapter';
import type { Event, FileRecord, TimelineItem, Song } from '@/lib/data-adapter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { EventChat } from '@/components/shared/EventChat';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Lock, FileSignature, BadgeDollarSign, Loader2, File, Download, CheckCircle, Music, Plus, Ban, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';

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
        toast({
            title: "Simulating Payment...",
            description: "You are being redirected to a mock payment page.",
        });
    };

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
                <MusicPreferences eventId={eventId} />
            </TabsContent>
            <TabsContent value="communication">
                 <EventChat eventId={eventId} role="host" />
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


export default async function AppEventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  return <AppEventDetailClient eventId={eventId} />;
}
