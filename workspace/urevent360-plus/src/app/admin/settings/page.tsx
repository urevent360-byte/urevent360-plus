'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Bell, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

const settingsSections = [
    {
        title: 'My Profile',
        description: 'Manage your personal account details, profile picture, and password.',
        icon: <User className="h-6 w-6 text-primary" />,
        link: '/admin/settings/profile',
    },
    {
        title: 'General Settings',
        description: 'Configure API keys, integrations, and other global platform configurations.',
        icon: <SlidersHorizontal className="h-6 w-6 text-primary" />,
        link: '/admin/settings/general',
    },
    {
        title: 'Notifications',
        description: 'Manage email and push notification preferences for you and your team.',
        icon: <Bell className="h-6 w-6 text-primary" />,
        link: '/admin/settings/notifications',
    },
];

export default function SettingsPage() {

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
                    <p className="text-muted-foreground">Manage global platform settings and your personal profile.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {settingsSections.map(section => (
                    <Card key={section.title}>
                        <CardHeader className="flex flex-row items-start gap-4">
                            {section.icon}
                            <div>
                                <CardTitle>{section.title}</CardTitle>
                                <CardDescription>{section.description}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="outline">
                                <Link href={section.link}>
                                    Go to {section.title}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
