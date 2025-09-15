
'use client';

import { getLead, convertLeadToEvent } from '@/lib/data-adapter';
import { notFound, useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Calendar, FileText, ArrowRight, Check, X, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Lead } from '@/lib/data-adapter';
import { format } from 'date-fns';

type ServiceQuote = {
    name: string;
    price: number;
};

// This is a client component that receives the initial lead data
function LeadDetailClient({ initialLead }: { initialLead: Lead }) {
    const router = useRouter();
    const { toast } = useToast();
    const [lead, setLead] = useState<Lead>(initialLead);
    const [quotes, setQuotes] = useState<ServiceQuote[]>(
        lead.requestedServices.map(service => ({ name: service, price: 0 }))
    );
    const [deposit, setDeposit] = useState(0);
    const [isConverting, setIsConverting] = useState(false);

    const handlePriceChange = (index: number, price: string) => {
        const newQuotes = [...quotes];
        newQuotes[index].price = parseFloat(price) || 0;
        setQuotes(newQuotes);
    };
    
    const total = quotes.reduce((acc, q) => acc + q.price, 0);

    const handleConvert = async () => {
        setIsConverting(true);
        toast({
            title: 'Converting Lead...',
            description: 'This may take a moment.',
        });
        try {
            const { eventId } = await convertLeadToEvent(lead.id);
            toast({
                title: 'Success!',
                description: 'Lead converted to project. Redirecting...',
            });
            router.push(`/admin/events/${eventId}`);
        } catch (error) {
            console.error(error);
            toast({
                title: 'Conversion Failed',
                description: 'Could not convert lead to project.',
                variant: 'destructive',
            });
            setIsConverting(false);
        }
    };
    
    return (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content: Quote Builder */}
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Quote Builder</CardTitle>
                        <CardDescription>Price the requested services and send the quote to the client.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Service</TableHead>
                                    <TableHead className="w-40 text-right">Price (USD)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {quotes.map((quote, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{quote.name}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                className="text-right"
                                                placeholder="0.00"
                                                value={quote.price === 0 ? '' : quote.price}
                                                onChange={(e) => handlePriceChange(index, e.target.value)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell className="font-semibold">Deposit</TableCell>
                                    <TableCell>
                                        <Input 
                                            type="number" 
                                            className="text-right font-semibold" 
                                            placeholder="0.00"
                                            value={deposit === 0 ? '' : deposit}
                                            onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Separator className="my-4" />
                        <div className="flex justify-end items-center gap-4 text-lg font-bold">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar: Details & Actions */}
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Lead Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex items-center gap-2">
                            <User className="text-muted-foreground" />
                            <span>{lead.name} ({lead.email})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="text-muted-foreground" />
                            <span>Event on: {format(new Date(lead.eventDraft.eventDate), 'PPP')}</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <FileText className="text-muted-foreground" />
                            <span>Event name: {lead.eventDraft.eventName}</span>
                        </div>
                        {lead.eventDraft.notes && (
                             <p className="text-muted-foreground border-l-2 pl-3">{lead.eventDraft.notes}</p>
                        )}
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                         <Button className="w-full" onClick={handleConvert} disabled={isConverting}>
                            {isConverting ? 'Converting...' : 'Convert to Project'}
                            <ArrowRight />
                         </Button>
                         <Button variant="outline" className="w-full"><Mail /> Send Quote</Button>
                         <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="w-full"><Check /> Mark Accepted</Button>
                            <Button variant="destructive" className="w-full"><X /> Mark Rejected</Button>
                         </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


export default function AdminLeadDetailPage({ params }: { params: { leadId: string } }) {
  // Fetch data on the server
  const leadData = use(getLead(params.leadId));

  // If lead not found, show 404
  if (!leadData) {
    notFound();
  }

  // Pass server-fetched data to the client component
  return <LeadDetailClient initialLead={leadData} />;
}
