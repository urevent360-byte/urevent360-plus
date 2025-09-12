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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

const placeholderLeads = [
    { id: 'lead1', name: 'John Doe', email: 'john@example.com', date: '2024-07-30', status: 'new' },
    { id: 'lead2', name: 'Jane Smith', email: 'jane@example.com', date: '2024-07-29', status: 'contacted' },
    { id: 'lead3', name: 'Peter Jones', email: 'peter@example.com', date: '2024-07-28', status: 'follow-up' },
    { id: 'lead4', name: 'Mary Brown', email: 'mary@example.com', date: '2024-07-27', status: 'converted' },
];

type Status = 'new' | 'contacted' | 'follow-up' | 'converted' | 'archived';

const statusColors: Record<Status, string> = {
    new: 'bg-blue-500',
    contacted: 'bg-yellow-500',
    'follow-up': 'bg-orange-500',
    converted: 'bg-green-500',
    archived: 'bg-gray-500',
};

export default function LeadsPage() {
  const [filter, setFilter] = useState<Status | 'all'>('all');

  const filteredLeads = placeholderLeads.filter(lead => filter === 'all' || lead.status === filter);

  return (
    <div>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Leads CRM</h1>
                <p className="text-muted-foreground">Manage all incoming client inquiries.</p>
            </div>
            {/* AI Assistant button can go here in the future */}
        </div>

        <Card>
            <CardHeader>
                <CardTitle>All Inquiries</CardTitle>
                <CardDescription>A list of all leads from the contact form.</CardDescription>
                <div className="flex items-center gap-2 pt-4">
                    <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
                    <Button variant={filter === 'new' ? 'default' : 'outline'} onClick={() => setFilter('new')}>New</Button>
                    <Button variant={filter === 'contacted' ? 'default' : 'outline'} onClick={() => setFilter('contacted')}>Contacted</Button>
                    <Button variant={filter === 'follow-up' ? 'default' : 'outline'} onClick={() => setFilter('follow-up')}>Follow-up</Button>
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
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuItem>Add Note</DropdownMenuItem>
                                        <DropdownMenuItem>Assign to Team</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
