

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

type EventGalleryProps = {
    role: 'host' | 'admin';
    event: Event | null;
    onLinkChange: () => void;
};

type GuestUpload = {
    url: string;
    alt: string;
};

function GalleryLoader() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-video" />)}
                    </div>
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

    return (
        <div className="space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Photo Booth Album Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Camera /> Photo Booth Album</CardTitle>
                        <CardDescription>Access the official, curated album from your event.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {role === 'admin' ? (
                            <div className="flex flex-col gap-2">
                                <Input
                                    placeholder="https://photos.app.goo.gl/..."
                                    value={photoBoothLink}
                                    onChange={(e) => setPhotoBoothLink(e.target.value)}
                                />
                                <Button onClick={handleSaveLink} disabled={isSaving}>
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
                                <p className="text-sm text-muted-foreground">Awaiting link from Admin.</p>
                            )
                        )}
                    </CardContent>
                </Card>

                 {/* Guest Uploads Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PartyPopper /> Guest Uploads</CardTitle>
                        <CardDescription>Photos taken by your guests will appear after the event.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary" onClick={() => document.getElementById('guest-uploads-grid')?.scrollIntoView({ behavior: 'smooth' })}>
                           <Eye className="mr-2" /> View Guest Photos
                        </Button>
                         {!isGalleryVisible && role === 'host' && event.galleryVisibilityDate && (
                            <p className="text-xs text-muted-foreground mt-2">
                                Available on {format(new Date(event.galleryVisibilityDate), 'MMM d, yyyy')}.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Design Approval Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ThumbsUp/> Photo Design</CardTitle>
                        <CardDescription>Review and approve your custom photo strip design.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button variant="secondary">
                            <Eye className="mr-2" /> View Design
                         </Button>
                         {event.design?.status === 'approved' && (
                            <Badge className="ml-2">Approved</Badge>
                         )}
                    </CardContent>
                </Card>
            </div>

            {/* Retention Policy & Guest QR Section */}
            <Card>
                 <CardHeader>
                    <CardTitle>Guest QR & Download</CardTitle>
                    <CardDescription>Manage guest access and download all photos.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6 items-start">
                     <div className="space-y-4">
                        <Button variant="outline" asChild><Link href={`/app/events/${event.id}?tab=guest-qr`}><GitMerge className="mr-2"/> Open QR Manager</Link></Button>
                        <Button variant="outline"><Download className="mr-2"/> Download All (ZIP)</Button>
                        {role === 'admin' && (
                             <Button variant="destructive"><Trash2 className="mr-2"/> Purge Now</Button>
                        )}
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
                            </AlertDescription>
                        )}
                    </Alert>
                </CardContent>
            </Card>

            {/* Guest Uploads Grid */}
            <div id="guest-uploads-grid">
                <Card>
                    <CardHeader>
                        <CardTitle>Community Uploads Grid</CardTitle>
                        <CardDescription>Photos uploaded by the host and their guests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isGalleryVisible || role === 'admin' ? (
                            <>
                                {guestUploads.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {guestUploads.map((photo, index) => (
                                            <div key={index} className="group aspect-video relative rounded-lg overflow-hidden shadow-md">
                                                <Image src={photo.url} alt={photo.alt} fill className="object-cover" />
                                                <Badge variant="secondary" className="absolute bottom-2 left-2">Guest</Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">No community photos have been uploaded yet.</p>
                                )}
                            </>
                        ) : (
                            <p className="text-muted-foreground text-center py-8">
                                Guest photos will be available here starting {event.galleryVisibilityDate ? format(new Date(event.galleryVisibilityDate), 'PPP') : 'soon'}.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
