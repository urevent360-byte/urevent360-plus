
'use client';

import { UserProfile } from '@/components/shared/UserProfile';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import locales from '@/lib/locales.json';
import { useState } from 'react';

export default function AdminProfilePage() {
    const [language, setLanguage] = useState<'en' | 'es'>('en');

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <Button variant="outline" asChild>
                    <Link href="/admin/settings">
                        <ArrowLeft className="mr-2" />
                        {locales.ui.back[language]}
                    </Link>
                </Button>
            </div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{locales.profile.title[language]}</h1>
                    <p className="text-muted-foreground">{locales.profile.subtitle[language]}</p>
                </div>
            </div>
            <UserProfile role="admin" />
        </div>
    );
}

    