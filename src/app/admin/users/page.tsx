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
import { PlusCircle, Shield } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const placeholderUsers = [
    { id: 'user1', name: 'Admin User', email: 'admin@example.com', role: 'Super Admin' },
    { id: 'user2', name: 'John Editor', email: 'john@example.com', role: 'Service Editor' },
    { id: 'user3', name: 'Jane Photographer', email: 'jane@example.com', role: 'Photo Editor' },
];

export default function UserManagementPage() {
  return (
    <div>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <p className="text-muted-foreground">Add, edit, or manage administrator roles.</p>
            </div>
            <Button>
                <PlusCircle className="mr-2" />
                Add New User
            </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Admin Users</CardTitle>
                <CardDescription>A list of all users with admin-level access.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {placeholderUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="gap-1">
                                    <Shield className="h-3 w-3" />
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="mr-2">
                                    Edit
                                </Button>
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
