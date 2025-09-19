
'use client';

import { UserProfile } from '@/components/shared/UserProfile';
import locales from '@/lib/locales.json';
import { useState } from 'react';

export default function AppProfilePage() {
    const [language, setLanguage] = useState<'en' | 'es'>('en');

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{locales.profile.title[language]}</h1>
                    <p className="text-muted-foreground">{locales.profile.subtitle[language]}</p>
                </div>
            </div>
            <UserProfile role="host" />
        </div>
    );
}

    