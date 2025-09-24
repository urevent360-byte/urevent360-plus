
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, ArrowLeft, Video, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { upsertServiceAction, getServiceAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import servicesCatalog from '@/lib/services-catalog.json';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';

const serviceSchema = z.object({
  id: z.string().min(2, 'ID is required and must be unique.'),
  label: z.string().min(2, 'Service label is required.'),
  category: z.string().min(1, 'Category is required.'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters.'),
  features: z.array(z.string().min(3, 'Feature text cannot be empty.')).min(1, 'At least one feature is required.'),
  keywords: z.array(z.string().min(2, 'Keyword cannot be empty.')).min(1, 'At least one keyword is required.'),
  qualifiers: z.array(z.string().min(10, 'Qualifier text cannot be empty.')).min(1, 'At least one qualifier question is required.'),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().min(2, 'Alt text is required.'),
  })).min(1, 'At least one image is required.'),
  visible: z.boolean().default(false),
  packageCode: z.string().optional(),
  qbItem: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const allCategories = [...new Set(servicesCatalog.services.map(s => s.category))];

const ArrayFieldManager = ({ name, control, label, description }: { name: any, control: any, label: string, description: string }) => {
    const { fields, append, remove } = useFieldArray({ control, name });
    return (
        <div className="space-y-4">
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
            {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                    <FormField
                        control={control}
                        name={`${name}.${index}`}
                        render={({ field }) => (
                            <FormItem className="flex-grow">
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><X className="h-4 w-4"/></Button>
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append('')}>
                <PlusCircle className="mr-2"/>Add {label.slice(0,-1)}
            </Button>
        </div>
    );
};


export default function ServiceFormPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const serviceId = searchParams.get('id');
    const isEditing = !!serviceId;
    
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(isEditing);

    const form = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            id: '',
            label: '',
            category: '',
            shortDescription: '',
            features: [],
            keywords: [],
            qualifiers: [],
            images: [],
            visible: false,
            packageCode: '',
            qbItem: '',
        },
    });

     useEffect(() => {
        if (isEditing) {
            const fetchService = async () => {
                setIsLoading(true);
                const result = await getServiceAction(serviceId);
                if (result.success && result.service) {
                    form.reset(result.service as ServiceFormValues);
                } else {
                    toast({ title: "Error", description: result.message, variant: "destructive" });
                    router.push('/admin/services');
                }
                setIsLoading(false);
            };
            fetchService();
        }
    }, [isEditing, serviceId, form, toast, router]);


    const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
        control: form.control,
        name: 'images',
    });
    
    async function onSubmit(data: ServiceFormValues) {
        const result = await upsertServiceAction(data, isEditing);
        if (result.success) {
            toast({
                title: 'Service Saved!',
                description: `The service "${data.label}" has been successfully saved.`,
            });
            router.push('/admin/services');
            router.refresh();
        } else {
            toast({
                title: 'Error',
                description: result.message || 'An unknown error occurred.',
                variant: 'destructive',
            });
        }
    }
    
    if (isLoading) {
        return (
             <div>
                <div className="mb-8"><Skeleton className="h-10 w-40"/></div>
                <div className="space-y-8">
                    <Skeleton className="h-96 w-full"/>
                    <Skeleton className="h-64 w-full"/>
                </div>
             </div>
        )
    }

  return (
    <div>
        <div className="mb-8">
            <Button variant="outline" asChild>
                <Link href="/admin/services">
                    <ArrowLeft className="mr-2" />
                    Back to Services
                </Link>
            </Button>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Service' : 'Add New Service'}</CardTitle>
                    <CardDescription>Fill out the details for the service below. The 'ID' field must be unique and cannot be changed after creation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Service Label</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Magic Mirror" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Service ID (Canonical)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., magic_mirror" {...field} disabled={isEditing} />
                                    </FormControl>
                                    <FormDescription>Unique identifier. Cannot be changed.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {allCategories.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                 <FormDescription>Select an existing category or type a new one to create it.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="shortDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Short Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="A brief, catchy description for service cards." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ArrayFieldManager name="features" control={form.control} label="Features" description="List key features of the service." />
                        <ArrayFieldManager name="keywords" control={form.control} label="Keywords" description="For search and AI mapping. (e.g., '360', 'cabina 360')" />
                        <ArrayFieldManager name="qualifiers" control={form.control} label="Qualifier Questions" description="Questions the AI will ask for this service." />
                     </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Photo Gallery Management</CardTitle>
                    <CardDescription>Upload, replace, or delete images for this service.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {imageFields.map((image, index) => (
                            <div key={image.id} className="relative group border rounded-lg p-2 space-y-2">
                                <Image
                                    src={image.url}
                                    alt={image.alt}
                                    width={400}
                                    height={300}
                                    className="rounded-md aspect-[4/3] object-cover w-full bg-muted"
                                />
                                 <FormField
                                    control={form.control}
                                    name={`images.${index}.url`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Image URL</FormLabel>
                                            <FormControl><Input {...field}/></FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`images.${index}.alt`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Alt Text</FormLabel>
                                            <FormControl><Input placeholder="Describe the image" {...field}/></FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" type="button" variant="destructive" className="h-8 w-8" onClick={() => removeImage(index)}>
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </div>
                            </div>
                        ))}
                         <div 
                            className="flex flex-col items-center justify-center w-full min-h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
                            onClick={() => appendImage({ url: 'https://picsum.photos/seed/new/800/600', alt: ''})}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground text-center">Click to add image</p>
                            </div>
                        </div>
                    </div>
                     {form.formState.errors.images && <p className="text-sm text-destructive mt-2">{form.formState.errors.images.message}</p>}
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Internal Codes & Visibility</CardTitle>
                    <CardDescription>Set internal tracking codes and control public visibility.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="packageCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Package Code</FormLabel>
                                    <FormControl><Input placeholder="e.g., PHT-360" {...field} /></FormControl>
                                    <FormDescription>Internal code for packaging rules.</FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="qbItem"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>QuickBooks Item</FormLabel>
                                    <FormControl><Input placeholder="e.g., Service-360-Booth" {...field} /></FormControl>
                                    <FormDescription>The corresponding item name in QuickBooks.</FormDescription>
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="visible"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Visible on Public Site</FormLabel>
                                <FormDescription>
                                    Show this service on the public-facing services page.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                        />
                </CardContent>
            </Card>


             <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Service')}
                </Button>
            </div>
        </form>
        </Form>
    </div>
  );
}
