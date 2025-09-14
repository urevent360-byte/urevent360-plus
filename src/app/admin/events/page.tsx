
'use client';

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
import { MoreHorizontal, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';

type ProjectStatus = 'planning' | 'active' | 'completed' | 'on-hold';

type Project = {
    id: string;
    clientName: string;
    eventName: string;
    eventDate: string;
    status: ProjectStatus;
};

const placeholderProjects: Project[] = [
    { id: 'evt-john-doe-2024', clientName: 'John Doe', eventName: "John's Quinceañera", eventDate: '2024-08-25', status: 'planning' },
    { id: 'evt-david-lee-2024', clientName: 'David Lee', eventName: "Lee Corporate Gala", eventDate: '2024-07-20', status: 'completed' },
    { id: 'evt-maria-garcia-2024', clientName: 'Maria Garcia', eventName: "Garcia Wedding", eventDate: '2024-09-15', status: 'active' },
    { id: 'evt-jane-smith-2024', clientName: 'Jane Smith', eventName: "Smith & Co Product Launch", eventDate: '2024-10-01', status: 'on-hold' },
];

const statusDetails: Record<ProjectStatus, {
    label: string;
    icon: JSX.Element;
    badgeClass: string;
}> = {
    planning: {
        label: 'Planning',
        icon: <Clock className="h-3 w-3" />,
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    active: {
        label: 'Active',
        icon: <CheckCircle className="h-3 w-3 text-green-600" />,
        badgeClass: 'bg-green-100 text-green-800 border-green-300',
    },
    completed: {
        label: 'Completed',
        icon: <CheckCircle className="h-3 w-3" />,
        badgeClass: 'bg-gray-100 text-gray-800 border-gray-300',
    },
    'on-hold': {
        label: 'On Hold',
        icon: <AlertTriangle className="h-3 w-3 text-yellow-600" />,
        badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    }
};

export default function EventsPage() {

  return (
    <div>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Events / Projects</h1>
                <p className="text-muted-foreground">Manage all active, planned, and completed client events.</p>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>All Events</CardTitle>
                <CardDescription>
                    This is a list of all confirmed events that have been converted from leads.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Event Name</TableHead>
                            <TableHead>Event Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {placeholderProjects.map((project) => (
                        <TableRow key={project.id}>
                            <TableCell>
                                <div className="font-medium">{project.clientName}</div>
                            </TableCell>
                            <TableCell>{project.eventName}</TableCell>
                            <TableCell>{project.eventDate}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={`flex items-center w-fit gap-1 ${statusDetails[project.status].badgeClass}`}>
                                    {statusDetails[project.status].icon}
                                    {statusDetails[project.status].label}
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
                                            <Link href={`/admin/events/${project.id}`}>
                                                View Project Details
                                            </Link>
                                        </DropdownMenuItem>
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
