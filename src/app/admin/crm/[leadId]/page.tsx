
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function LeadDetailPage() {
    const params = useParams();
    const { leadId } = params;

    return (
        <div>
            <div className="mb-8">
                <Button variant="outline" asChild>
                    <Link href="/admin/crm">
                        <ArrowLeft className="mr-2" />
                        Back to Leads
                    </Link>
                </Button>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Lead Details</CardTitle>
                    <CardDescription>
                        Viewing details for lead: <span className="font-bold">{leadId}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-muted-foreground">Lead detail content will go here. This will include lead info and an option to convert to a project.</p>
                </CardContent>
            </Card>
        </div>
    );
}
