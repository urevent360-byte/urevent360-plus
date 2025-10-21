
'use client';

import { useState, useEffect } from 'react';
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
import { PlusCircle, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { getServicesAction, deleteServiceAction, reorderServicesAction, Service } from './[serviceId]/actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ServiceManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const { toast } = useToast();

  const fetchServices = async () => {
    const result = await getServicesAction();
    if (result.success && result.services) {
      setServices(result.services);
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchServices();
  }, [toast]);

  const handleDelete = async (serviceId: string) => {
    const result = await deleteServiceAction(serviceId);
    if (result.success) {
      toast({ title: "Service Deleted", description: "The service has been removed from the catalog."});
      fetchServices(); // Refresh the list
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  }

  const handleReorder = async (serviceId: string, direction: 'up' | 'down') => {
      const result = await reorderServicesAction(serviceId, direction);
      if (result.success) {
          toast({ title: "Service Moved", description: "The service order has been updated." });
          fetchServices(); // Refresh the list
      } else {
          toast({ title: "Error", description: result.message, variant: "destructive" });
      }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Management</h1>
          <p className="text-muted-foreground">Add, edit, or delete your event services.</p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">
            <PlusCircle className="mr-2" />
            Add New Service
          </Link>
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
                <TableHead className="w-[80px]">Position</TableHead>
                <TableHead>Service Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service, index) => (
                <TableRow key={service.id}>
                  <TableCell>
                      <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleReorder(service.id, 'up')} disabled={index === 0}>
                              <ArrowUp className="h-4 w-4"/>
                          </Button>
                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleReorder(service.id, 'down')} disabled={index === services.length - 1}>
                              <ArrowDown className="h-4 w-4"/>
                          </Button>
                      </div>
                  </TableCell>
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell>{service.category}</TableCell>
                   <TableCell>
                      <Badge variant={service.active ? 'default' : 'secondary'}>
                        {service.active ? 'Public' : 'Hidden'}
                      </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild className="mr-2">
                      <Link href={`/admin/services/${service.id}`}><Edit className="mr-2 h-4 w-4"/>Edit</Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the service
                            from the catalog.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(service.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
