
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthProvider';
import { getEvent } from '@/lib/data-adapter';
import type { Event } from '@/lib/data-adapter';
import { Skeleton } from '@/components/ui/skeleton';
import { format, isPast, isFuture } from 'date-fns';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { PartyPopper, Clock, Download } from 'lucide-react';
import Image from 'next/image';

const guestUploads = [
    { url: 'https://picsum.photos/seed/guest1/400/300', alt: 'Guest photo 1' },
    { url: 'https://picsum.photos/seed/guest2/400/300', alt: 'Guest photo 2' },
    { url: 'https://picsum.photos/seed/guest3/400/300', alt: 'Guest photo 3' },
    { url: 'https://picsum.photos/seed/guest4/400/300', alt: 'Guest photo 4' },
    { url: 'https://picsum.photos/seed/guest5/400/300', alt: 'Guest photo 5' },
    { url: 'https://picsum.photos/seed/guest6/400/300', alt: 'Guest photo 6' },
];

function GalleryLoader() {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-40" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-square" />)}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function AppGalleryPage() {
    const { user } = useAuth();
    // In a real app, we'd fetch the user's *active* event. Here we hardcode an ID for a booked event.
    const eventId = 'evt-456'; 
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchEvent() {
            if (user) {
                setIsLoading(true);
                const fetchedEvent = await getEvent(eventId);
                if (fetchedEvent) {
                    setEvent(fetchedEvent);
                }
                setIsLoading(false);
            }
        }
        fetchEvent();
    }, [user]);

    if (isLoading) {
        return <GalleryLoader />;
    }

    if (!event) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Event Not Found</AlertTitle>
                <AlertDescription>We couldn&apos;t find gallery information for your event.</AlertDescription>
            </Alert>
        )
    }

    const isGalleryVisible = event.galleryVisibilityDate ? isPast(new Date(event.galleryVisibilityDate)) : false;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Event Gallery</h1>
                    <p className="text-muted-foreground">Access your professional photos and guest uploads for &quot;{event.eventName}&quot;.</p>
                </div>
            </div>
            
            {!isGalleryVisible && event.galleryVisibilityDate && isFuture(new Date(event.galleryVisibilityDate)) && (
                <Alert className="mb-8">
                    <Clock className="h-4 w-4" />
                    <AlertTitle>Your Gallery is Almost Ready!</AlertTitle>
                    <AlertDescription>
                        Your photos and videos will become available on {format(new Date(event.galleryVisibilityDate), 'PPP')}.
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Official Photo Booth Album</CardTitle>
                        <CardDescription>Photos and videos taken by our professional equipment.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isGalleryVisible && event.photoboothLink ? (
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
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Community Uploads</CardTitle>
                        <CardDescription>Photos uploaded by you and your guests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         {isGalleryVisible ? (
                             <>
                                {guestUploads.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {guestUploads.map((photo, index) => (
                                            <div key={index} className="aspect-video relative rounded-lg overflow-hidden">
                                                <Image src={photo.url} alt={photo.alt} fill className="object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No community photos have been uploaded yet.</p>
                                )}
                             </>
                        ) : (
                            <p className="text-muted-foreground">
                                Community photos will be available here once your gallery is visible.
                            </p>
                        )}
                    </CardContent>
                     {isGalleryVisible && guestUploads.length > 0 && (
                        <CardFooter>
                            <Button variant="secondary">
                                <Download className="mr-2" />
                                Download All as ZIP
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
}
