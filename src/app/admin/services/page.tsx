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
import { PlusCircle } from 'lucide-react';

const placeholderServices = [
    { id: 1, name: '360 Photo Booth', category: 'Photo Booth', lastUpdated: '2024-07-28' },
    { id: 2, name: 'Magic Mirror', category: 'Photo Booth', lastUpdated: '2024-07-27' },
    { id: 3, name: 'La Hora Loca', category: 'Entertainment', lastUpdated: '2024-07-25' },
    { id: 4, name: 'Cold Sparklers', category: 'Special Effects', lastUpdated: '2024-07-22' },
];

export default function ServiceManagementPage() {
  return (
    <div>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Service Management</h1>
                <p className="text-muted-foreground">Add, edit, or delete your event services.</p>
            </div>
            <Button>
                <PlusCircle className="mr-2" />
                Add New Service
            </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Existing Services</CardTitle>
                <CardDescription>A list of all services currently offered.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Service Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {placeholderServices.map((service) => (
                        <TableRow key={service.id}>
                            <TableCell className="font-medium">{service.id}</TableCell>
                            <TableCell>{service.name}</TableCell>
                            <TableCell>{service.category}</TableCell>
                            <TableCell>{service.lastUpdated}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="mr-2">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
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
