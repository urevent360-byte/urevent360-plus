
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AppInquiriesPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Inquiries</h1>
                    <p className="text-muted-foreground">Track the status of your service inquiries.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Inquiry History</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This section will show a history of all inquiries you've submitted, along with their current status (e.g., "Pending", "Quote Sent", "Confirmed"). Coming soon.</p>
                </CardContent>
            </Card>
        </div>
    );
}
