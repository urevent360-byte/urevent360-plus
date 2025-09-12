
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CloudCog, Bell, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminGalleryPage() {
    const { toast } = useToast();

    const handleRunFlow = (flowName: string) => {
        // In a real app, this would trigger the Genkit flow on the backend.
        // For this UI, we'll just simulate it with a toast.
        toast({
            title: 'Flow Triggered!',
            description: `The "${flowName}" flow has been started in the background.`,
        });
        console.log(`Simulating trigger for ${flowName}`);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gallery Automation</h1>
                    <p className="text-muted-foreground">Manage automated gallery tasks and AI flows.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Scheduled Tasks (Genkit Flows)</CardTitle>
                    <CardDescription>
                        These functions run automatically on a schedule (e.g., daily). You can also trigger them manually for testing.
                        These are placeholder triggers; deployment is required for true automation.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-semibold flex items-center gap-2"><Trash2 /> Delete Expired Photos</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Automatically deletes photos from events where the gallery expiration date has passed.
                                </p>
                            </div>
                            <Button variant="outline" onClick={() => handleRunFlow('deleteExpiredPhotosFlow')}>
                                Run Manually
                            </Button>
                        </div>
                    </Card>
                    <Card className="p-4">
                         <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-semibold flex items-center gap-2"><Bell /> Notify on Gallery Visibility</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Sends an email notification to clients when their event gallery becomes visible.
                                </p>
                            </div>
                            <Button variant="outline" onClick={() => handleRunFlow('notifyOnGalleryVisibilityFlow')}>
                                Run Manually
                            </Button>
                        </div>
                    </Card>
                </CardContent>
            </Card>
        </div>
    );
}
