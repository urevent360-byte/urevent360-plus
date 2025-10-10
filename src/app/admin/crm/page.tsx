
'use client';

// Opt-out de SSG para esta ruta
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, QrCode, Link as LinkIcon, CalendarCog, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import QRCode from "qrcode.react";
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import locales from '@/lib/locales.json';

type Status = 'new' | 'contacted' | 'follow-up' | 'quote_sent' | 'accepted' | 'converted' | 'rejected';

type Lead = {
    id: string;
    name: string;
    email: string;
    date: string;
    status: Status;
    eventId: string | null;
};

const placeholderLeads: Lead[] = [
    { id: 'lead-123', name: 'John Doe', email: 'client@urevent360.com', date: '2024-08-25', status: 'converted', eventId: 'evt-123' },
    { id: 'lead2', name: 'Jane Smith', email: 'jane@example.com', date: '2024-07-29', status: 'quote_sent', eventId: null },
    { id: 'lead3', name: 'Peter Jones', email: 'peter@example.com', date: '2024-07-28', status: 'follow-up', eventId: null },
    { id: 'lead4', name: 'Maria Garcia', email: 'maria@example.com', date: '2024-09-15', status: 'new', eventId: null },
    { id: 'lead-456', name: 'David Lee', email: 'david@example.com', date: '2024-07-20', status: 'converted', eventId: 'evt-456' },
    { id: 'lead6', name: 'Samantha Wu', email: 'sam@example.com', date: '2024-09-18', status: 'contacted', eventId: null },
    { id: 'lead7', name: 'Chris Green', email: 'chris@example.com', date: '2024-09-20', status: 'accepted', eventId: null },
];

const statusColors: Record<Status, string> = {
    new: 'bg-blue-500',
    contacted: 'bg-yellow-500',
    'follow-up': 'bg-orange-500',
    quote_sent: 'bg-purple-500',
    accepted: 'bg-teal-500',
    converted: 'bg-green-500',
    rejected: 'bg-gray-500',
};

const allStatuses: Status[] = ['new', 'contacted', 'follow-up', 'quote_sent', 'accepted', 'converted', 'rejected'];

export default function CrmPage() {
  const [leads] = useState<Lead[]>(placeholderLeads);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [qrCodeData, setQrCodeData] = useState<{url: string, eventId: string} | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const filteredLeads = leads.filter(lead => filter === 'all' || lead.status === filter);
  
  const handleActionClick = (eventId: string) => {
      toast({
          title: 'Action Redirect',
          description: `This action should be performed on the event management page. Redirecting...`,
      });
      router.push(`/admin/events/${eventId}`);
  };


  return (
    <div>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{locales.crm.title[language]}</h1>
                <p className="text-muted-foreground">Manage client inquiries and converted events.</p>
            </div>
             <div className="flex items-center gap-2">
                <Button variant={language === 'en' ? 'default' : 'outline'} onClick={() => setLanguage('en')}>EN</Button>
                <Button variant={language === 'es' ? 'default' : 'outline'} onClick={() => setLanguage('es')}>ES</Button>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>{locales.crm.allInquiries[language]}</CardTitle>
                <CardDescription>A list of all leads from the contact form. Converted events have QR and Photo Booth link capabilities.</CardDescription>
                <div className="flex items-center gap-2 pt-4 flex-wrap">
                    <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
                    {allStatuses.map(status => (
                        <Button 
                            key={status}
                            variant={filter === status ? 'default' : 'outline'} 
                            onClick={() => setFilter(status)}
                            className="capitalize"
                        >
                            {locales.status[status as keyof typeof locales.status][language]}
                        </Button>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLeads.map((lead) => (
                        <TableRow key={lead.id}>
                            <TableCell>
                                <div className="font-medium">{lead.name}</div>
                                <div className="text-sm text-muted-foreground">{lead.email}</div>
                            </TableCell>
                            <TableCell>{lead.date}</TableCell>
                            <TableCell>
                                <Badge className={`${statusColors[lead.status as Status]} text-white capitalize hover:${statusColors[lead.status as Status]}`}>
                                    {locales.status[lead.status as keyof typeof locales.status][language]}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/admin/crm/${lead.id}`}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                {locales.crm.viewEditLead[language]}
                                            </Link>
                                        </DropdownMenuItem>
                                        {lead.eventId && (
                                          <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleActionClick(lead.eventId!)}>
                                                <QrCode className="mr-2 h-4 w-4" />
                                                {locales.crm.generateUploadQr[language]}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleActionClick(lead.eventId!)}>
                                                <LinkIcon className="mr-2 h-4 w-4" />
                                                {locales.crm.addPhotoboothLink[language]}
                                            </DropdownMenuItem>
                                             <DropdownMenuItem asChild>
                                                <Link href={`/admin/events/${lead.eventId}`}>
                                                    <CalendarCog className="mr-2 h-4 w-4" />
                                                    {locales.crm.manageEventSettings[language]}
                                                </Link>
                                            </DropdownMenuItem>
                                          </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Dialog open={!!qrCodeData} onOpenChange={(isOpen) => !isOpen && setQrCodeData(null)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Event Photo Upload QR Code</DialogTitle>
                    <DialogDescription>
                        This generates a unique QR code for guests to upload photos to the event gallery for <span className="font-bold">"{qrCodeData?.eventId}"</span>. This action should now be performed on the Event Management page.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center p-4">
                    {qrCodeData && (
                        <QRCode
                            value={qrCodeData.url}
                            size={256}
                            level={"H"}
                            includeMargin={true}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>

    </div>
  );
}
