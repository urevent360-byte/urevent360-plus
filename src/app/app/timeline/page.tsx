
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AppTimelinePage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Event Timeline</h1>
                    <p className="text-muted-foreground">Review the schedule for your event.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Event Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This section will display a detailed timeline for your event, including setup times, service start/end times, and any other key moments. You will be able to review and approve the schedule here. Coming soon.</p>
                </CardContent>
            </Card>
        </div>
    );
}

