
'use client';

import { useState } from 'react';
import type { Event } from '@/lib/data-adapter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
            {tabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
            ))}
        </TabsList>
        
        {/* Placeholder content for each tab */}
        <TabsContent value="details"><Card><CardHeader><CardTitle>Event Details</CardTitle></CardHeader><CardContent><p>Details about the event will be managed here.</p></CardContent></Card></TabsContent>
        <TabsContent value="billing"><Card><CardHeader><CardTitle>Billing & Invoices</CardTitle></CardHeader><CardContent><p>Create and manage invoices. The host cannot see this tab.</p><p>A button to 'Create Invoice' will appear here, which will generate a QuickBooks invoice, save the payment record, and set the event status to 'invoice_sent'.</p></CardContent></Card></TabsContent>
        <TabsContent value="timeline"><Card><CardHeader><CardTitle>Event Timeline</CardTitle></CardHeader><CardContent><p>Admins can approve timeline items and sync them to Google Calendar.</p></CardContent></Card></TabsContent>
        <TabsContent value="files"><Card><CardHeader><CardTitle>Files</CardTitle></CardHeader><CardContent><p>Upload invoices, contracts, and other documents. View signed documents from the client.</p></CardContent></Card></TabsContent>
        <TabsContent value="gallery"><Card><CardHeader><CardTitle>Gallery Settings</CardTitle></CardHeader><CardContent><p>Configure photo booth album URLs, QR code settings, and gallery visibility windows.</p></CardContent></Card></TabsContent>
        <TabsContent value="guest-qr"><Card><CardHeader><CardTitle>Guest Upload QR Code</CardTitle></CardHeader><CardContent><p>Generate and display the QR code for guest photo uploads.</p></CardContent></Card></TabsContent>
        <TabsContent value="music"><Card><CardHeader><CardTitle>Music Playlist</CardTitle></CardHeader><CardContent><p>Manage music requests and do-not-play lists.</p></CardContent></Card></TabsContent>
        <TabsContent value="communication"><Card><CardHeader><CardTitle>Communication</CardTitle></CardHeader><CardContent><p>A dedicated chat for this event between the admin and the host.</p></CardContent></Card></TabsContent>
        <TabsContent value="my-services"><Card><CardHeader><CardTitle>Requested Services</CardTitle></CardHeader><CardContent><p>Admin can approve additional service requests from the host. Approved services are then added to the invoice.</p></CardContent></Card></TabsContent>
        
      </Tabs>
    </div>
  );
}
