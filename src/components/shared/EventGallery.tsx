
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
import { PartyPopper, Clock, Download, Save } from 'lucide-react';
import Image from 'next/image';

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
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
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

    const handleSaveLink = async () => {
        if (!event) return;
        setIsSaving(true);
        await setPhotoBoothLink(event.id, photoBoothLink);
        setIsSaving(false);
        onLinkChange(); // Notify parent to refetch event data
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
            {!isGalleryVisible && event.galleryVisibilityDate && isFuture(new Date(event.galleryVisibilityDate)) && (
                <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertTitle>Gallery Not Yet Visible</AlertTitle>
                    <AlertDescription>
                        The gallery photos and links will become visible to the host on {format(new Date(event.galleryVisibilityDate), 'PPP')}.
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Official Photo Booth Album</CardTitle>
                    <CardDescription>
                        {role === 'admin'
                            ? "Set the link to the professional photo booth gallery. This link will be visible to the host."
                            : "Photos and videos taken by our professional equipment."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {role === 'admin' ? (
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="https://photos.app.goo.gl/..."
                                value={photoBoothLink}
                                onChange={(e) => setPhotoBoothLink(e.target.value)}
                            />
                            <Button onClick={handleSaveLink} disabled={isSaving}>
                                <Save className="mr-2" />
                                {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    ) : (
                        isGalleryVisible && event.photoboothLink ? (
                             <Button asChild>
                                <Link href={event.photoboothLink} target="_blank">
                                    <PartyPopper className="mr-2" />
                                    View Official Album
                                </Link>
                            </Button>
                        ) : (
                            <p className="text-muted-foreground">
                                {isGalleryVisible ? "The official album link has not been added by the admin yet." : "This link will appear here once the gallery is visible."}
                            </p>
                        )
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Community Uploads</CardTitle>
                    <CardDescription>Photos uploaded by the host and their guests.</CardDescription>
                </CardHeader>
                <CardContent>
                     {isGalleryVisible || role === 'admin' ? (
                         <>
                            {guestUploads.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {guestUploads.map((photo, index) => (
                                        <div key={index} className="aspect-video relative rounded-lg overflow-hidden shadow-md">
                                            <Image src={photo.url} alt={photo.alt} fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">No community photos have been uploaded yet.</p>
                            )}
                         </>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">
                            Community photos will be available here once your gallery is visible.
                        </p>
                    )}
                </CardContent>
                 {(isGalleryVisible || role === 'admin') && guestUploads.length > 0 && (
                    <CardFooter>
                        <Button variant="secondary">
                            <Download className="mr-2" />
                            Download All as ZIP
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
