
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function EventDetailPage() {
    const params = useParams();
    const { eventId } = params;

    return (
        <div>
            <div className="mb-8">
                <Button variant="outline" asChild>
                    <Link href="/admin/events">
                        <ArrowLeft className="mr-2" />
                        Back to Events
                    </Link>
                </Button>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Event/Project Details</CardTitle>
                    <CardDescription>
                        Viewing details for project: <span className="font-bold">{eventId}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-muted-foreground">This page will show the full project profile for the admin, including timeline, tasks, client info, etc.</p>
                </CardContent>
            </Card>
        </div>
    );
}
