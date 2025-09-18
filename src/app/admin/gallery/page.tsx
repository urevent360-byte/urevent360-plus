
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteExpiredPhotosFlow, notifyOnGalleryVisibilityFlow, handleContractSignedWebhookFlow, handleDepositWebhookFlow } from '@/ai/flows/gallery-automation';

export default function AdminGalleryPage() {
    const { toast } = useToast();

    const handleRunFlow = async (flowName: string) => {
        toast({
            title: 'Triggering Flow...',
            description: `Starting the "${flowName}" flow in the background.`,
        });

        try {
            let result;
            if (flowName === 'deleteExpiredPhotosFlow') {
                result = await deleteExpiredPhotosFlow();
            } else if (flowName === 'notifyOnGalleryVisibilityFlow') {
                result = await notifyOnGalleryVisibilityFlow();
            } else if (flowName === 'handleContractSignedWebhookFlow') {
                // Simulate webhook payload
                result = await handleContractSignedWebhookFlow({ eventId: 'evt-123', signedPdfUrl: 'https://example.com/signed.pdf' });
            } else if (flowName === 'handleDepositWebhookFlow') {
                // Simulate webhook payload
                 result = await handleDepositWebhookFlow({ eventId: 'evt-123', invoiceId: 'inv-001' });
            }

            toast({
                title: 'Flow Completed!',
                description: `${flowName} finished successfully. Result: ${JSON.stringify(result)}`,
            });
        } catch (error) {
             toast({
                title: 'Flow Error!',
                description: `Error running ${flowName}: ${error instanceof Error ? error.message : String(error)}`,
                variant: 'destructive'
            });
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gallery & Event Automation</h1>
                    <p className="text-muted-foreground">Manage automated tasks and webhook simulations.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Scheduled Tasks</CardTitle>
                        <CardDescription>
                            These functions can run automatically on a schedule. Trigger them manually for testing.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Card className="p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold flex items-center gap-2"><Trash2 /> Delete Expired Photos</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Deletes photos from events where the gallery expiration date has passed.
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
                                        Sends an email to clients when their gallery becomes visible.
                                    </p>
                                </div>
                                <Button variant="outline" onClick={() => handleRunFlow('notifyOnGalleryVisibilityFlow')}>
                                    Run Manually
                                </Button>
                            </div>
                        </Card>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Webhook Simulators</CardTitle>
                        <CardDescription>
                           Simulate incoming webhooks from external services like DocuSign or QuickBooks.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Card className="p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold">Contract Signed Webhook</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Simulates a client signing their contract.
                                    </p>
                                </div>
                                <Button variant="outline" onClick={() => handleRunFlow('handleContractSignedWebhookFlow')}>
                                    Simulate
                                </Button>
                            </div>
                        </Card>
                        <Card className="p-4">
                             <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold">Deposit Paid Webhook</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Simulates a client paying their deposit invoice.
                                    </p>
                                </div>
                                <Button variant="outline" onClick={() => handleRunFlow('handleDepositWebhookFlow')}>
                                    Simulate
                                </Button>
                            </div>
                        </Card>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
