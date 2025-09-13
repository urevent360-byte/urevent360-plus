
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AppProfilePage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                    <p className="text-muted-foreground">Manage your account and contact information.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This section will allow you to update your name, contact information, and password. Coming soon.</p>
                </CardContent>
            </Card>
        </div>
    );
}
