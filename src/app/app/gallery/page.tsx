
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// In a real app, this would be fetched based on the logged-in user
const eventData = {
    photoboothLink: 'https://photos.app.goo.gl/sample1',
    galleryVisibilityDate: new Date('2024-09-25'),
    communityUploads: [
        { url: 'https://picsum.photos/seed/guest1/400/300', alt: 'Guest photo 1' },
        { url: 'https://picsum.photos/seed/guest2/400/300', alt: 'Guest photo 2' },
        { url: 'https://picsum.photos/seed/guest3/400/300', alt: 'Guest photo 3' },
    ]
};

export default function AppGalleryPage() {
    const isGalleryVisible = new Date() > eventData.galleryVisibilityDate;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Event Gallery</h1>
                    <p className="text-muted-foreground">Access your professional photos and guest uploads.</p>
                </div>
            </div>

            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Official Photo Booth Album</CardTitle>
                        <CardDescription>Photos and videos taken by our professional equipment.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isGalleryVisible ? (
                             <Button asChild>
                                <Link href={eventData.photoboothLink} target="_blank">View Album</Link>
                            </Button>
                        ) : (
                            <p className="text-muted-foreground">
                                Your official album will be available on {eventData.galleryVisibilityDate.toLocaleDateString()}.
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
                            <div>
                                <p className="text-muted-foreground mb-4">This feature will show a grid of all photos uploaded by guests via the event's QR code.</p>
                                <p className="text-muted-foreground">Coming soon.</p>
                            </div>
                        ) : (
                            <p className="text-muted-foreground">
                                Community photos will be available on {eventData.galleryVisibilityDate.toLocaleDateString()}.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
