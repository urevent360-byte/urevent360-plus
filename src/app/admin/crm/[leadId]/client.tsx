
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, User, Calendar, FileText, Send, Check, Box, Loader2, Info, PlusCircle } from 'lucide-react';
import { getLead, convertLeadToEvent, sendQuote, markAccepted } from '@/lib/data-adapter';
import type { Lead } from '@/lib/data-adapter';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import locales from '@/lib/locales.json';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import servicesCatalog from '@/lib/services-catalog.json';

type QuoteLineItem = {
    id: string;
    title: string;
    price: number;
};

export default function LeadDetailClient({ leadId }: { leadId: string }) {
    const [lead, setLead] = useState<Lead | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConverting, setIsConverting] = useState(false);
    const [quoteItems, setQuoteItems] = useState<QuoteLineItem[]>([]);
    const router = useRouter();
    const { toast } = useToast();
    const [language, setLanguage] = useState<'en' | 'es'>('en');

    useEffect(() => {
        async function fetchLead() {
            setIsLoading(true);
            const fetchedLead = await getLead(leadId);
            if (fetchedLead) {
                setLead(fetchedLead);
                const initialQuoteItems = (fetchedLead.requestedServices || []).map(service => {
                    const catalogItem = servicesCatalog.services.find(s => s.id === service.serviceId);
                    return {
                        id: service.serviceId,
                        title: catalogItem?.label || service.title,
                        price: 0,
                    };
                });
                setQuoteItems(initialQuoteItems);
            }
            setIsLoading(false);
        }
        fetchLead();
    }, [leadId]);

    const handlePriceChange = (serviceId: string, value: string) => {
        const price = Number(value) || 0;
        setQuoteItems(prev => prev.map(item => item.id === serviceId ? { ...item, price } : item));
    };
    
    const handleAddServiceToQuote = (service: typeof servicesCatalog.services[0]) => {
        if (!quoteItems.some(item => item.id === service.id)) {
            setQuoteItems(prev => [...prev, { id: service.id, title: service.label, price: 0 }]);
        }
    };

    const quoteTotal = quoteItems.reduce((sum, item) => sum + item.price, 0);

    const handleSendQuote = async () => {
        if (!lead) return;
        await sendQuote(lead.id);
        setLead(prev => prev ? { ...prev, status: 'quote_sent' } : null);
        toast({ title: 'Quote Sent!', description: `An email has been simulated for ${lead.email}.` });
    };
    
    const handleMarkAccepted = async () => {
        if (!lead) return;
        await markAccepted(lead.id);
        setLead(prev => prev ? { ...prev, status: 'accepted' } : null);
        toast({ title: 'Lead Marked as Accepted!', description: 'You can now convert this lead to a project.' });
    };

    const handleConvertToProject = async () => {
        if (!lead) return;
        setIsConverting(true);
        try {
            const { eventId } = await convertLeadToEvent(lead.id);
            toast({
                title: 'Conversion Successful!',
                description: `Lead has been converted to Event ID: ${eventId}. Redirecting...`,
            });
            router.push(`/admin/events/${eventId}`);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to convert lead to project.', variant: 'destructive' });
            setIsConverting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-8 w-1/4" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-8">
                        <Skeleton className="h-48" />
                        <Skeleton className="h-48" />
                    </div>
                    <div className="lg:col-span-2">
                        <Skeleton className="h-96" />
                    </div>
                </div>
            </div>
        );
    }

    if (!lead) {
        return <p>Lead not found.</p>;
    }
    
    const availableServicesToAdd = servicesCatalog.services.filter(
        s => !quoteItems.some(qi => qi.id === s.id)
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                     <Button variant="outline" size="sm" asChild className="mb-4">
                        <Link href="/admin/crm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to CRM
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Lead: {lead.name}</h1>
                    <p className="text-muted-foreground mt-1">Manage this inquiry and convert it into a project.</p>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSendQuote} disabled={lead.status === 'converted'}>
                        <Send className="mr-2" /> {locales.crm.sendQuote[language]}
                    </Button>
                     <Button variant="outline" onClick={handleMarkAccepted} disabled={!['quote_sent'].includes(lead.status)}>
                        <Check className="mr-2" /> {locales.crm.markAccepted[language]}
                    </Button>
                    <Button onClick={handleConvertToProject} disabled={isConverting || !['accepted'].includes(lead.status)}>
                        {isConverting ? <Loader2 className="mr-2 animate-spin" /> : <Box className="mr-2" />}
                        {locales.crm.convertToProject[language]}
                    </Button>
                </div>
            </div>
            
            {lead.status === 'converted' && lead.eventId && (
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Lead Already Converted</AlertTitle>
                    <AlertDescription>
                        This lead has already been converted into a project.
                        <Button variant="link" className="p-0 pl-1 h-auto" asChild>
                           <Link href={`/admin/events/${lead.eventId}`}>View the project here.</Link>
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><User /> Client Information</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <p><strong>Name:</strong> {lead.name}</p>
                            <p><strong>Email:</strong> {lead.email}</p>
                             <p><strong>Status:</strong> <span className="capitalize font-medium p-1 rounded-md bg-secondary text-secondary-foreground">{locales.status[lead.status as keyof typeof locales.status][language]}</span></p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Calendar /> Event Draft</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <p><strong>Event Name:</strong> {lead.eventDraft.name}</p>
                            <p><strong>Proposed Date:</strong> {format(new Date(lead.eventDraft.date), 'PPP')}</p>
                            {lead.eventDraft.notes && <p><strong>Notes:</strong> {lead.eventDraft.notes}</p>}
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FileText /> Quote Builder</CardTitle>
                            <CardDescription>Enter prices for the requested services. This is only visible to admins.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Service</TableHead>
                                        <TableHead className="w-[150px] text-right">Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {quoteItems.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.title}</TableCell>
                                            <TableCell className="text-right">
                                                <Input 
                                                    type="number" 
                                                    className="text-right"
                                                    placeholder="0.00"
                                                    value={item.price || ''}
                                                    onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="border-t-2 border-primary/20 bg-muted/40">
                                         <TableHead className="text-right">Total</TableHead>
                                         <TableHead className="text-right font-bold text-lg">
                                            ${quoteTotal.toFixed(2)}
                                         </TableHead>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="mt-4">
                                        <PlusCircle className="mr-2"/>
                                        Add Service to Quote
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {availableServicesToAdd.map(service => (
                                        <DropdownMenuItem key={service.id} onClick={() => handleAddServiceToQuote(service)}>
                                            {service.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
