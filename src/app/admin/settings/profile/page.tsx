
'use client';

import { UserProfile } from '@/components/shared/UserProfile';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminProfilePage() {
    return (
        <div>
            <div className="mb-8">
                <Button variant="outline" asChild>
                    <Link href="/admin/settings">
                        <ArrowLeft className="mr-2" />
                        Back to Settings
                    </Link>
                </Button>
            </div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                    <p className="text-muted-foreground">Manage your administrator account details.</p>
                </div>
            </div>
            <UserProfile role="admin" />
        </div>
    );
}
