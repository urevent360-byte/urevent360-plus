
'use client';

import { UserProfile } from '@/components/shared/UserProfile';

export default function AdminProfilePage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                    <p className="text-muted-foreground">Manage your administrator account.</p>
                </div>
            </div>
            <UserProfile role="admin" />
        </div>
    );
}
