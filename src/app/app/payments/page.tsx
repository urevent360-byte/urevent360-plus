
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AppPaymentsPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                    <p className="text-muted-foreground">View your invoices and payment history.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This section will list all your invoices, showing amounts due, payment dates, and current status. You'll be able to make payments securely through this portal. Coming soon.</p>
                </CardContent>
            </Card>
        </div>
    );
}
