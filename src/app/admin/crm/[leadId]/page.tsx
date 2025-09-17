
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, User, Calendar, FileText, Send, Check, Box, Loader2, Info } from 'lucide-react';
import { getLead, convertLeadToEvent, sendQuote, markAccepted } from '@/lib/data-adapter';
import type { Lead } from '@/lib/data-adapter';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Link from 'next/link';

function LeadDetailClient({ params }: { params: { leadId: string } }) {
    const { leadId } = params;
    const [lead, setLead] = useState<Lead | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConverting, setIsConverting] = useState(false);
    const [quotePrices, setQuotePrices] = useState<Record<string, number>>({});
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        async function fetchLead() {
            setIsLoading(true);
            const fetchedLead = await getLead(leadId);
            if (fetchedLead) {
                setLead(fetchedLead);
                const initialPrices = fetchedLead.requestedServices.reduce((acc, service) => {
                    acc[service] = 0;
                    return acc;
                }, {} as Record<string, number>);
                setQuotePrices(initialPrices);
            }
            setIsLoading(false);
        }
        fetchLead();
    }, [leadId]);

    const handlePriceChange = (service: string, value: string) => {
        const price = Number(value) || 0;
        setQuotePrices(prev => ({ ...prev, [service]: price }));
    };

    const quoteTotal = Object.values(quotePrices).reduce((sum, price) => sum + price, 0);

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
                        <Send className="mr-2" /> Send Quote
                    </Button>
                     <Button variant="outline" onClick={handleMarkAccepted} disabled={!['quote_sent'].includes(lead.status)}>
                        <Check className="mr-2" /> Mark Accepted
                    </Button>
                    <Button onClick={handleConvertToProject} disabled={isConverting || !['accepted', 'converted'].includes(lead.status)}>
                        {isConverting ? <Loader2 className="mr-2 animate-spin" /> : <Box className="mr-2" />}
                        {lead.status === 'converted' ? 'View Project' : 'Convert to Project'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><User /> Client Information</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <p><strong>Name:</strong> {lead.name}</p>
                            <p><strong>Email:</strong> {lead.email}</p>
                             <p><strong>Status:</strong> <span className="capitalize font-medium p-1 rounded-md bg-secondary text-secondary-foreground">{lead.status.replace('_', ' ')}</span></p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Calendar /> Event Draft</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <p><strong>Event Name:</strong> {lead.eventDraft.eventName}</p>
                            <p><strong>Proposed Date:</strong> {format(new Date(lead.eventDraft.eventDate), 'PPP')}</p>
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
                                    {lead.requestedServices.map(service => (
                                        <TableRow key={service}>
                                            <TableCell className="font-medium">{service}</TableCell>
                                            <TableCell className="text-right">
                                                <Input 
                                                    type="number" 
                                                    className="text-right"
                                                    placeholder="0.00"
                                                    value={quotePrices[service] || ''}
                                                    onChange={(e) => handlePriceChange(service, e.target.value)}
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
                        </CardContent>
                    </Card>
                    {lead.status === 'converted' && lead.eventId && (
                        <Card className="mt-4 border-green-500">
                             <CardHeader>
                                <CardTitle className="text-green-600 flex items-center gap-2"><Info /> Already Converted</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>This lead has been converted to Event ID: <span className="font-bold">{lead.eventId}</span>.</p>
                                <Button size="sm" className="mt-2" onClick={() => router.push(`/admin/events/${lead.eventId}`)}>
                                    Go to Project Page
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function AdminLeadDetailPage({ params }: { params: { leadId: string } }) {
  return <LeadDetailClient params={params} />;
}
