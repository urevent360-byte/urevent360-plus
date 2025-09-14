
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AppEventDetailPage() {
    const params = useParams();
    const { eventId } = params;

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
             <Card>
                <CardHeader>
                    <CardTitle>My Event Details</CardTitle>
                    <CardDescription>
                        Viewing details for your event: <span className="font-bold">{eventId}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-muted-foreground">This page will show the event profile for the host, including timeline, payment status, gallery links, etc.</p>
                </CardContent>
            </Card>
        </div>
    );
}
