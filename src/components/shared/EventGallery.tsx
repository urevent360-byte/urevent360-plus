

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getGuestUploads, setPhotoBoothLink } from '@/lib/data-adapter';
import type { Event } from '@/lib/data-adapter';
import { Skeleton } from '@/components/ui/skeleton';
import { format, isPast, isFuture } from 'date-fns';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { PartyPopper, Clock, Download, Save, Eye, Camera, ThumbsUp, GitMerge, FileArchive, Trash2, Shield } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

type EventGalleryProps = {
    role: 'host' | 'admin';
    event: Event | null;
    onLinkChange: () => void;
};

type GuestUpload = {
    url: string;
    alt: string;
    thumbUrl: string;
};

function GalleryLoader() {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => <Skeleton key={i} className="aspect-video" />)}
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        </div>
    );
}

export function EventGallery({ role, event, onLinkChange }: EventGalleryProps) {
    const { toast } = useToast();
    const [guestUploads, setGuestUploads] = useState<GuestUpload[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [photoBoothLink, setPhotoBoothLink] = useState(event?.photoboothLink || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function fetchUploads() {
            if (event) {
                setIsLoading(true);
                const uploads = await getGuestUploads(event.id);
                setGuestUploads(uploads);
                setIsLoading(false);
            }
        }
        fetchUploads();
    }, [event]);
    
    useEffect(() => {
        setPhotoBoothLink(event?.photoboothLink || '');
    }, [event?.photoboothLink]);

    const handleSaveLink = async () => {
        if (!event) return;
        setIsSaving(true);
        await setPhotoBoothLink(event.id, photoBoothLink);
        setIsSaving(false);
        onLinkChange();
        toast({
            title: 'Link Saved!',
            description: 'The official photo booth album link has been updated.',
        });
    };

    if (isLoading) {
        return <GalleryLoader />;
    }

    if (!event) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Event data could not be loaded for the gallery.</AlertDescription>
            </Alert>
        );
    }
    
    const isGalleryVisible = event.galleryVisibilityDate ? isPast(new Date(event.galleryVisibilityDate)) : false;
    const isGalleryActive = isGalleryVisible && (event.galleryExpirationDate ? isFuture(new Date(event.galleryExpirationDate)) : true);

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Official Album & Guest Uploads</CardTitle>
                    <CardDescription>Access the curated album and photos uploaded by your guests.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2"><Camera /> Official Photo Booth Album</h3>
                        <p className="text-sm text-muted-foreground mb-4">This is the link to the professionally curated photo booth album.</p>
                        {role === 'admin' ? (
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Input
                                    placeholder="https://photos.app.goo.gl/..."
                                    value={photoBoothLink}
                                    onChange={(e) => setPhotoBoothLink(e.target.value)}
                                />
                                <Button onClick={handleSaveLink} disabled={isSaving} className="flex-shrink-0">
                                    <Save className="mr-2" />
                                    {isSaving ? 'Saving...' : 'Save Link'}
                                </Button>
                            </div>
                        ) : (
                            event.photoboothLink ? (
                                <Button asChild>
                                    <Link href={event.photoboothLink} target="_blank">
                                        <Eye className="mr-2" /> View Photo Booth Album
                                    </Link>
                                </Button>
                            ) : (
                                <p className="text-sm text-muted-foreground p-4 border rounded-md text-center">Awaiting link from Admin.</p>
                            )
                        )}
                    </div>
                    
                    <Separator />

                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2"><PartyPopper /> Community Uploads Grid</h3>
                         <p className="text-sm text-muted-foreground mb-4">Photos uploaded by the host and their guests.</p>
                        {isGalleryActive || role === 'admin' ? (
                            <>
                                {guestUploads.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {guestUploads.map((photo, index) => (
                                            <div key={index} className="group aspect-video relative rounded-lg overflow-hidden shadow-md">
                                                <Image src={photo.thumbUrl} alt={photo.alt} fill className="object-cover" />
                                                <Badge variant="secondary" className="absolute bottom-2 left-2">Guest</Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">No community photos have been uploaded yet.</p>
                                )}
                            </>
                        ) : (
                             <Alert className="text-center">
                                <Clock className="h-4 w-4" />
                                <AlertTitle>
                                    {event.galleryVisibilityDate && isFuture(new Date(event.galleryVisibilityDate)) ? "Guest Gallery Not Yet Visible" : "Guest Gallery Has Expired"}
                                </AlertTitle>
                                <AlertDescription>
                                    {event.galleryVisibilityDate && isFuture(new Date(event.galleryVisibilityDate))
                                        ? `Photos from your guests will appear here starting ${format(new Date(event.galleryVisibilityDate), 'PPP')}.`
                                        : (event.galleryExpirationDate ? `The viewing window for guest photos ended on ${format(new Date(event.galleryExpirationDate), 'PPP')}.` : 'The gallery viewing window has passed.')
                                    }
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Gallery Tools & Settings</CardTitle>
                    <CardDescription>Manage guest access, downloads, and photo strip designs.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-base">Actions</h3>
                        <div className="flex flex-col sm:flex-row gap-2">
                             <Button variant="outline" asChild><Link href={role === 'admin' ? `/admin/events/${event.id}?tab=guest-qr` : `/app/events/${event.id}?tab=guest-qr`}><GitMerge className="mr-2"/> QR Manager</Link></Button>
                             <Button variant="outline"><Download className="mr-2"/> Download All</Button>
                        </div>
                        <h3 className="font-semibold text-base pt-4">Photo Design</h3>
                         <div className="flex items-center gap-2">
                             <Button variant="secondary" asChild>
                                <Link href={role === 'admin' ? `/admin/designs` : `/app/designs`}>
                                    <Eye className="mr-2" /> View Design
                                </Link>
                             </Button>
                             {event.design?.status === 'approved' && (
                                <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
                             )}
                         </div>
                    </div>
                     <Alert variant="default">
                        <Shield className="h-4 w-4"/>
                        <AlertTitle>30-Day Retention Policy</AlertTitle>
                        {role === 'host' && event.galleryPolicy && event.galleryVisibilityDate && event.galleryExpirationDate ? (
                             <AlertDescription>
                                Guest-uploaded photos are visible to you starting {event.galleryPolicy.releaseDelayDays} days after the event and will be automatically deleted on {format(new Date(event.galleryExpirationDate), 'PPP')}.
                            </AlertDescription>
                        ) : (
                            <AlertDescription>
                                Guest uploads are stored for a limited time post-event before automatic deletion. You can archive them before they are purged.
                                 {role === 'admin' && <Button variant="destructive" size="sm" className="mt-2"><Trash2 className="mr-2"/>Purge Now</Button>}
                            </AlertDescription>
                        )}
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}
