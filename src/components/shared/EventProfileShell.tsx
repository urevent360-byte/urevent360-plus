
'use client';

import { useState } from 'react';
import type { Event } from '@/lib/data-adapter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Skeleton } from '../ui/skeleton';

type EventProfileShellProps = {
  event: Event;
  role: 'admin' | 'host';
  children: React.ReactNode;
  isLoading?: boolean;
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

export function EventProfileShell({ event, role, children, isLoading = false }: EventProfileShellProps) {
    const [activeTab, setActiveTab] = useState('details');

    const tabs = role === 'admin' ? adminTabs : adminTabs.filter(tab => tab.value !== 'billing');

    if (isLoading) {
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
        <CardHeader>
          <CardTitle>Project: {event.eventName}</CardTitle>
          <CardDescription>
            Client: {event.clientName} | Event Date: {format(new Date(event.eventDate), 'PPP')} | Status: <span className="capitalize font-medium">{event.status.replace('_', ' ')}</span>
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
            {tabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
            ))}
        </TabsList>
        
        {children}
        
      </Tabs>
    </div>
  );
}

    