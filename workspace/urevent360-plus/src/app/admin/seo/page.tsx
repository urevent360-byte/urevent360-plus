'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SeoPage() {

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">SEO Management</h1>
                    <p className="text-muted-foreground">Manage SEO settings for services and pages.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                    <CardDescription>
                       This section will contain tools to manage meta titles, descriptions, and keywords for different pages and services to improve search engine rankings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-muted-foreground">Coming soon...</p>
                </CardContent>
            </Card>
        </div>
    );
}
