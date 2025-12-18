
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type InquiryStatus = 'Pending' | 'Quote Sent' | 'Confirmed';

const placeholderInquiries = [
    {
        id: 'inq1',
        services: ['360 Photo Booth', 'Cold Sparklers'],
        date: new Date('2024-07-28'),
        status: 'Confirmed' as InquiryStatus,
    },
    {
        id: 'inq2',
        services: ['Magic Mirror'],
        date: new Date('2024-08-15'),
        status: 'Quote Sent' as InquiryStatus,
    },
    {
        id: 'inq3',
        services: ['La Hora Loca with LED Robot', 'Dance on the Clouds'],
        date: new Date('2024-08-20'),
        status: 'Pending' as InquiryStatus,
    },
];

const statusDetails: Record<InquiryStatus, {
    label: string;
    icon: JSX.Element;
    badgeClass: string;
}> = {
    Pending: {
        label: 'Pending Review',
        icon: <Clock className="mr-2 h-4 w-4 text-yellow-600" />,
        badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    'Quote Sent': {
        label: 'Quote Sent',
        icon: <FileText className="mr-2 h-4 w-4 text-blue-600" />,
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    Confirmed: {
        label: 'Confirmed',
        icon: <CheckCircle className="mr-2 h-4 w-4 text-green-600" />,
        badgeClass: 'bg-green-100 text-green-800 border-green-300',
    },
};


export default function AppInquiriesPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Inquiries</h1>
                    <p className="text-muted-foreground">Track the status of your event inquiries.</p>
                </div>
                 <Button asChild>
                    <Link href="/app/events/new">Create New Inquiry</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Inquiry History</CardTitle>
                    <CardDescription>A list of all inquiries you&apos;ve submitted and their current status.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {placeholderInquiries.map((inquiry) => (
                        <Card key={inquiry.id}>
                            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                                <div className="md:col-span-2">
                                    <h3 className="font-semibold">{inquiry.services.join(' + ')}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Submitted on {format(inquiry.date, 'PPP')}
                                    </p>
                                </div>
                                <div>
                                    <Badge variant="outline" className={`flex items-center w-fit ${statusDetails[inquiry.status].badgeClass}`}>
                                        {statusDetails[inquiry.status].icon}
                                        {statusDetails[inquiry.status].label}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                     {placeholderInquiries.length === 0 && (
                         <div className="text-center text-muted-foreground py-12">
                            <p>You haven&apos;t made any inquiries yet.</p>
                         </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
