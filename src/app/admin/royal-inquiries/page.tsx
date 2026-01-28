
'use client';

import { useState, useEffect, useTransition } from 'react';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { getRoyalInquiriesAction, updateInquiryStatusAction, type RoyalInquiry, type RoyalInquiryStatus } from './actions';

const statusColors: Record<RoyalInquiryStatus, string> = {
  new: 'bg-blue-500 hover:bg-blue-500',
  contacted: 'bg-yellow-500 hover:bg-yellow-500',
  archived: 'bg-green-500 hover:bg-green-500',
};

const allStatuses: RoyalInquiryStatus[] = ['new', 'contacted', 'archived'];

export default function RoyalInquiriesPage() {
  const [inquiries, setInquiries] = useState<RoyalInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<RoyalInquiryStatus | 'all'>('all');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchInquiries() {
      setIsLoading(true);
      const { inquiries } = await getRoyalInquiriesAction();
      setInquiries(inquiries);
      setIsLoading(false);
    }
    fetchInquiries();
  }, []);

  const handleUpdateStatus = (id: string, status: RoyalInquiryStatus) => {
    startTransition(async () => {
      const result = await updateInquiryStatusAction(id, status);
      if (result.ok) {
        toast({ title: 'Status Updated', description: `Inquiry marked as ${status}.` });
        // Optimistically update UI
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
      } else {
        toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
      }
    });
  };

  const filteredInquiries = inquiries.filter(inquiry => filter === 'all' || inquiry.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Royal Celebration Jr. Inquiries</h1>
          <p className="text-muted-foreground">Manage all incoming requests for the Royal Celebration Jr. package.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Inquiries</CardTitle>
          <CardDescription>A list of all leads from the Royal Celebration Jr. form.</CardDescription>
          <div className="flex items-center gap-2 pt-4 flex-wrap">
            <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
            {allStatuses.map(status => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                onClick={() => setFilter(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Type</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Phone / ZIP</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : filteredInquiries.length === 0 ? (
                 <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No inquiries found for this filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell className="font-medium">{inquiry.eventType}</TableCell>
                    <TableCell>{inquiry.guests}</TableCell>
                    <TableCell>
                      <div>{inquiry.phone}</div>
                      <div className="text-xs text-muted-foreground">ZIP: {inquiry.zipcode}</div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{inquiry.notes || '-'}</TableCell>
                    <TableCell>{format(inquiry.createdAt.toDate(), 'PPP')}</TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[inquiry.status]} text-white capitalize`}>
                        {inquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a href={`https://wa.me/${inquiry.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                                Open in WhatsApp
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(inquiry.id, 'contacted')} disabled={inquiry.status === 'contacted'}>
                            Mark as Contacted
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(inquiry.id, 'closed')} disabled={inquiry.status === 'closed'}>
                            Mark as Closed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
