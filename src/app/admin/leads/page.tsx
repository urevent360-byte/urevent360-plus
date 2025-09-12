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
import { DatePicker } from '@/components/ui/date-picker';

const placeholderLeads = [
    { id: 'lead1', name: 'John Doe', email: 'john@example.com', date: '2024-08-25', status: 'confirmed', eventId: 'evt-john-doe-2024', photoboothLink: 'https://photos.app.goo.gl/sample1', visibilityDate: new Date('2024-09-25'), expirationDate: new Date('2024-10-25') },
    { id: 'lead2', name: 'Jane Smith', email: 'jane@example.com', date: '2024-07-29', status: 'contacted', eventId: 'evt-jane-smith-2024', photoboothLink: null, visibilityDate: null, expirationDate: null },
    { id: 'lead3', name: 'Peter Jones', email: 'peter@example.com', date: '2024-07-28', status: 'follow-up', eventId: 'evt-peter-jones-2024', photoboothLink: null, visibilityDate: null, expirationDate: null },
    { id: 'lead4', name: 'Maria Garcia', email: 'maria@example.com', date: '2024-09-15', status: 'new', eventId: 'evt-maria-garcia-2024', photoboothLink: null, visibilityDate: null, expirationDate: null },
    { id: 'lead5', name: 'David Lee', email: 'david@example.com', date: '2024-07-20', status: 'archived', eventId: 'evt-david-lee-2024', photoboothLink: null, visibilityDate: null, expirationDate: null },
];

type Status = 'new' | 'contacted' | 'follow-up' | 'converted' | 'archived' | 'confirmed';

const statusColors: Record<Status, string> = {
    new: 'bg-blue-500',
    contacted: 'bg-yellow-500',
    'follow-up': 'bg-orange-500',
    converted: 'bg-green-500',
    confirmed: 'bg-teal-500',
    archived: 'bg-gray-500',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState(placeholderLeads);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [qrCodeData, setQrCodeData] = useState<{url: string, eventId: string} | null>(null);
  const [linkModalState, setLinkModalState] = useState<{ isOpen: boolean; leadId: string | null, currentLink: string }>({ isOpen: false, leadId: null, currentLink: '' });
  const [eventSettingsModal, setEventSettingsModal] = useState<{ isOpen: boolean; lead: typeof placeholderLeads[0] | null }>({ isOpen: false, lead: null });

  const { toast } = useToast();

  const filteredLeads = leads.filter(lead => filter === 'all' || lead.status === filter);
  
  const generateQrCode = (eventId: string) => {
    const url = `${window.location.origin}/upload/${eventId}`;
    setQrCodeData({ url, eventId });
  };
  
  const handleSaveLink = () => {
    if (!linkModalState.leadId) return;

    setLeads(prevLeads => prevLeads.map(lead => 
      lead.id === linkModalState.leadId ? { ...lead, photoboothLink: linkModalState.currentLink } : lead
    ));

    toast({
      title: 'Link Saved!',
      description: 'The photo booth album link has been updated.',
    });
    setLinkModalState({ isOpen: false, leadId: null, currentLink: '' });
  };
  
  const handleSaveEventSettings = () => {
    if (!eventSettingsModal.lead) return;

    // In a real app, you would save this to the database
    // For now, we update the local state
    setLeads(prevLeads => prevLeads.map(l => 
        l.id === eventSettingsModal.lead!.id ? eventSettingsModal.lead! : l
    ));

    toast({
        title: "Event Settings Saved",
        description: `Settings for ${eventSettingsModal.lead.name}'s event have been updated.`
    });
    setEventSettingsModal({ isOpen: false, lead: null });
  };


  return (
    <div>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Leads & Events</h1>
                <p className="text-muted-foreground">Manage client inquiries and confirmed events.</p>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>All Inquiries</CardTitle>
                <CardDescription>A list of all leads from the contact form. Confirmed events have QR and Photo Booth link capabilities.</CardDescription>
                <div className="flex items-center gap-2 pt-4">
                    <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
                    <Button variant={filter === 'new' ? 'default' : 'outline'} onClick={() => setFilter('new')}>New</Button>
                    <Button variant={filter === 'contacted' ? 'default' : 'outline'} onClick={() => setFilter('contacted')}>Contacted</Button>
                    <Button variant={filter === 'follow-up' ? 'default' : 'outline'} onClick={() => setFilter('follow-up')}>Follow-up</Button>
                    <Button variant={filter === 'confirmed' ? 'default' : 'outline'} onClick={() => setFilter('confirmed')}>Confirmed</Button>
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
                                <Badge className={`${statusColors[lead.status as Status]} text-white hover:${statusColors[lead.status as Status]}`}>
                                    {lead.status.replace('-', ' ')}
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
                                        <DropdownMenuItem>
                                            <Edit className="mr-2 h-4 w-4" />
                                            View/Edit Lead
                                        </DropdownMenuItem>
                                        {lead.status === 'confirmed' && (
                                          <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => generateQrCode(lead.eventId)}>
                                                <QrCode className="mr-2 h-4 w-4" />
                                                Generate Upload QR
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setLinkModalState({ isOpen: true, leadId: lead.id, currentLink: lead.photoboothLink || '' })}>
                                                <LinkIcon className="mr-2 h-4 w-4" />
                                                Add Photo Booth Link
                                            </DropdownMenuItem>
                                             <DropdownMenuItem onClick={() => setEventSettingsModal({ isOpen: true, lead })}>
                                                <CalendarCog className="mr-2 h-4 w-4" />
                                                Manage Event Settings
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
                        Clients can scan this code to upload photos to the event gallery for "{qrCodeData?.eventId}".
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
                        Paste the public URL for the external photo booth album (e.g., Google Photos, Dropbox).
                    </DialogDescription>
                </Header>
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

        <Dialog open={eventSettingsModal.isOpen} onOpenChange={(isOpen) => !isOpen && setEventSettingsModal({ isOpen: false, lead: null })}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Manage Event Settings</DialogTitle>
                    <DialogDescription>
                        Control gallery visibility and expiration for {eventSettingsModal.lead?.name}'s event.
                    </DialogDescription>
                </Header>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="visibility-date" className="text-right">
                            Visible From
                        </Label>
                        <div className="col-span-3">
                           <DatePicker
                             date={eventSettingsModal.lead?.visibilityDate || undefined}
                             onDateChange={(date) => setEventSettingsModal(prev => prev.lead ? {...prev, lead: {...prev.lead, visibilityDate: date}} : prev)}
                           />
                        </div>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="visibility-date" className="text-right">
                            Expires On
                        </Label>
                        <div className="col-span-3">
                            <DatePicker
                                date={eventSettingsModal.lead?.expirationDate || undefined}
                                onDateChange={(date) => setEventSettingsModal(prev => prev.lead ? {...prev, lead: {...prev.lead, expirationDate: date}} : prev)}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSaveEventSettings}>Save Settings</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
