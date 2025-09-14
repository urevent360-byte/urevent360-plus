
'use client';

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
  DialogFooter,
} from "@/components/ui/dialog";
import QRCode from "qrcode.react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

type Status = 'new' | 'contacted' | 'follow-up' | 'quote_sent' | 'accepted' | 'converted' | 'rejected';

type Lead = {
    id: string;
    name: string;
    email: string;
    date: string;
    status: Status;
    eventId: string | null;
    photoboothLink: string | null;
};

const placeholderLeads: Lead[] = [
    { id: 'lead1', name: 'John Doe', email: 'client@urevent360.com', date: '2024-08-25', status: 'converted', eventId: 'evt-john-doe-2024', photoboothLink: 'https://photos.app.goo.gl/sample1' },
    { id: 'lead2', name: 'Jane Smith', email: 'jane@example.com', date: '2024-07-29', status: 'quote_sent', eventId: null, photoboothLink: null },
    { id: 'lead3', name: 'Peter Jones', email: 'peter@example.com', date: '2024-07-28', status: 'follow-up', eventId: null, photoboothLink: null },
    { id: 'lead4', name: 'Maria Garcia', email: 'maria@example.com', date: '2024-09-15', status: 'new', eventId: null, photoboothLink: null },
    { id: 'lead5', name: 'David Lee', email: 'david@example.com', date: '2024-07-20', status: 'rejected', eventId: null, photoboothLink: null },
    { id: 'lead6', name: 'Samantha Wu', email: 'sam@example.com', date: '2024-09-18', status: 'contacted', eventId: null, photoboothLink: null },
    { id: 'lead7', name: 'Chris Green', email: 'chris@example.com', date: '2024-09-20', status: 'accepted', eventId: null, photoboothLink: null },
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

export default function CrmPage() {
  const [leads, setLeads] = useState<Lead[]>(placeholderLeads);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [qrCodeData, setQrCodeData] = useState<{url: string, eventId: string} | null>(null);
  const [linkModalState, setLinkModalState] = useState<{ isOpen: boolean; leadId: string | null, currentLink: string }>({ isOpen: false, leadId: null, currentLink: '' });

  const { toast } = useToast();

  const filteredLeads = leads.filter(lead => filter === 'all' || lead.status === filter);
  
  const generateQrCode = (eventId: string) => {
    const url = `${window.location.origin}/upload/${eventId}`;
    setQrCodeData({ url, eventId });
  };
  
  const handleSaveLink = () => {
    if (!linkModalState.leadId) return;

    // In a real app, this would update events/{eventId}.photoBoothAlbumUrl in Firestore.
    // For this prototype, we'll just update the local state.
    setLeads(prevLeads => prevLeads.map(lead => 
      lead.id === linkModalState.leadId ? { ...lead, photoboothLink: linkModalState.currentLink } : lead
    ));

    toast({
      title: 'Link Saved!',
      description: 'The photo booth album link has been updated for the event.',
    });
    setLinkModalState({ isOpen: false, leadId: null, currentLink: '' });
  };


  return (
    <div>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">CRM & Leads</h1>
                <p className="text-muted-foreground">Manage client inquiries and converted events.</p>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>All Inquiries</CardTitle>
                <CardDescription>A list of all leads from the contact form. Converted events have QR and Photo Booth link capabilities.</CardDescription>
                <div className="flex items-center gap-2 pt-4 flex-wrap">
                    <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
                    <Button variant={filter === 'new' ? 'default' : 'outline'} onClick={() => setFilter('new')}>New</Button>
                    <Button variant={filter === 'contacted' ? 'default' : 'outline'} onClick={() => setFilter('contacted')}>Contacted</Button>
                    <Button variant={filter === 'follow-up' ? 'default' : 'outline'} onClick={() => setFilter('follow-up')}>Follow-up</Button>
                    <Button variant={filter === 'quote_sent' ? 'default' : 'outline'} onClick={() => setFilter('quote_sent')}>Quote Sent</Button>
                    <Button variant={filter === 'accepted' ? 'default' : 'outline'} onClick={() => setFilter('accepted')}>Accepted</Button>
                    <Button variant={filter === 'converted' ? 'default' : 'outline'} onClick={() => setFilter('converted')}>Converted</Button>
                    <Button variant={filter === 'rejected' ? 'default' : 'outline'} onClick={() => setFilter('rejected')}>Rejected</Button>
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
                                    {lead.status.replace('_', ' ')}
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
                                                View/Edit Lead
                                            </Link>
                                        </DropdownMenuItem>
                                        {lead.status === 'converted' && lead.eventId && (
                                          <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => generateQrCode(lead.eventId!)}>
                                                <QrCode className="mr-2 h-4 w-4" />
                                                Generate Upload QR
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setLinkModalState({ isOpen: true, leadId: lead.id, currentLink: lead.photoboothLink || '' })}>
                                                <LinkIcon className="mr-2 h-4 w-4" />
                                                Set Photo Booth Link
                                            </DropdownMenuItem>
                                             <DropdownMenuItem asChild>
                                                <Link href={`/admin/events/${lead.eventId}`}>
                                                    <CalendarCog className="mr-2 h-4 w-4" />
                                                    Manage Event Settings
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
                        This generates a unique QR code for guests to upload photos to the event gallery for <span className="font-bold">"{qrCodeData?.eventId}"</span>. This action modifies the event itself.
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
        
        <Dialog open={linkModalState.isOpen} onOpenChange={(isOpen) => !isOpen && setLinkModalState({ isOpen: false, leadId: null, currentLink: '' })}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Set Photo Booth Album Link</DialogTitle>
                    <DialogDescription>
                        Paste the public URL for the external photo booth album (e.g., Google Photos). This updates the <span className="font-bold">event's</span> record, not the lead.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="photobooth-link" className="text-right">
                            Album URL
                        </Label>
                        <Input
                            id="photobooth-link"
                            value={linkModalState.currentLink}
                            onChange={(e) => setLinkModalState(prev => ({...prev, currentLink: e.target.value}))}
                            className="col-span-3"
                            placeholder="https://..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSaveLink}>Save Link</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    </div>
  );
}
