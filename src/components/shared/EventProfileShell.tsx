'use client';

import { useState } from 'react';
import type { Event } from '@/lib/data-adapter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Calendar, QrCode } from 'lucide-react';
import Link from 'next/link';

type EventProfileShellProps = {
  event: Event | null;
  role: 'admin' | 'host';
  children: React.ReactNode;
  isLoading?: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isLocked?: boolean;
};

const adminTabs = [
  { value: 'details', label: 'Details' },
  { value: 'billing', label: 'Billing' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'files', label: 'Files' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'guest-qr', label: 'Guest QR' },
  { value: 'music', label: 'Music' },
  { value: 'communication', label: 'Communication' },
  { value: 'my-services', label: 'My Services' },
];

const hostTabs = [
  { value: 'details', label: 'Details' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'files', label: 'Files' },
  { value: 'gallery', label: 'My Gallery' },
  { value: 'music', label: 'Music' },
  { value: 'communication', label: 'Communication' },
  { value: 'my-services', label: 'My Services' },
]

export function EventProfileShell({ event, role, children, isLoading = false, activeTab, onTabChange, isLocked = false }: EventProfileShellProps) {

    const tabs = role === 'admin' ? adminTabs : hostTabs;

    if (isLoading || !event) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-10 w-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-40 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                    <CardTitle>Project: {event.eventName}</CardTitle>
                    <CardDescription>
                        Client: {event.clientName} | Event Date: {format(new Date(event.eventDate), 'PPP')} | Status: <span className="capitalize font-medium p-1 rounded-md bg-secondary text-secondary-foreground">{event.status.replace('_', ' ')}</span>
                    </CardDescription>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                     <Button variant="outline" size="sm">Change Event</Button>
                    {role === 'admin' && (
                        <>
                             <Button variant="outline" size="sm" asChild><Link href="/admin/calendar"><Calendar className="mr-2"/> Itinerary</Link></Button>
                            <Button variant="outline" size="sm"><QrCode className="mr-2"/> Guest QR</Button>
                        </>
                    )}
                </div>
            </CardHeader>
        </Card>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-5 lg:grid-cols-9">
            {tabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} disabled={isLocked && tab.value !== 'details'}>{tab.label}</TabsTrigger>
            ))}
        </TabsList>
        
        <div className="mt-4">
          {children}
        </div>
        
      </Tabs>
    </div>
  );
}
