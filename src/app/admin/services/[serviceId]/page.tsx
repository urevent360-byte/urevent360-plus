

'use client';

import * as React from 'react';
import { useForm, useFieldArray, Control, FieldValues, FieldPath, ArrayPath } from 'react-hook-form';
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
import { useRouter } from 'next/navigation';
import servicesCatalog from '@/lib/services-catalog.json';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';

const serviceSchema = z.object({
  id: z.string().min(2, 'ID is required and must be unique.'),
  slug: z.string().min(2, 'Slug must be unique.'),
  title: z.string().min(2, 'Service title is required.'),
  category: z.string().min(1, 'Category is required.'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters.'),
  longDescription: z.string().optional(),
  heroImage: z.string().url('A valid hero image URL is required.'),
  galleryImages: z.array(z.string().url()).optional(),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string().min(1, 'At least one keyword is required.')),
  qualifiers: z.array(z.string().min(1, 'At least one qualifier question is required.')),
  packageCode: z.string().optional(),
  qbItem: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const allCategories = [...new Set(servicesCatalog.services.map(s => s.category))];

type ArrayFieldManagerProps<T extends FieldValues> = {
  name: ArrayPath<T>;
  control: Control<T>;
  label: string;
  description: string;
};

const ArrayFieldManager = <T extends FieldValues>({ name, control, label, description }: ArrayFieldManagerProps<T>) => {
    const { fields, append, remove } = useFieldArray({ control, name });
    return (
        <div className="space-y-4">
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
            {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                    <FormField
                        control={control}
                        name={`${name}.${index}` as FieldPath<T>}
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
            <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '' } as any)}>
                <PlusCircle className="mr-2"/>Add {label.slice(0,-1)}
            </Button>
        </div>
    );
};


export default function ServiceFormPage({ params }: { params: { serviceId: string } }) {
    const router = useRouter();
    const serviceId = params.serviceId;
    const isEditing = serviceId !== 'new';
    
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(isEditing);

    const form = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            id: '',
            slug: '',
            title: '',
            category: '',
            shortDescription: '',
            longDescription: '',
            heroImage: '',
            galleryImages: [],
            active: false,
            featured: false,
            options: [],
            tags: [],
            keywords: [],
            qualifiers: [],
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
                    form.reset(result.service);
                } else {
                    toast({ title: "Error", description: result.message, variant: "destructive" });
                    router.push('/admin/services');
                }
                setIsLoading(false);
            };
            fetchService();
        }
    }, [isEditing, serviceId, form, toast, router]);


    const {
        fields: imageFields,
        append: appendImage,
        remove: removeImage,
      } = useFieldArray<ServiceFormValues, ArrayPath<ServiceFormValues>>({
        control: form.control,
        name: 'galleryImages' as ArrayPath<ServiceFormValues>, // 👈 forzar el tipo del path
      });
    
    async function onSubmit(data: ServiceFormValues) {
        // Ensure slug is a URL-friendly version of the ID
        const slug = data.id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const dataWithSlug = { ...data, slug };

        const result = await upsertServiceAction(dataWithSlug, isEditing);
        if (result.success) {
            toast({
                title: 'Service Saved!',
                description: `The service "${data.title}" has been successfully saved.`,
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
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Service Title</FormLabel>
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
                     <FormField
                        control={form.control}
                        name="longDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Long Description</FormLabel>
                                 <FormControl>
                                    <Textarea placeholder="A detailed description for the service page. Supports rich text." {...field} className="min-h-32" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ArrayFieldManager<ServiceFormValues> name={'keywords' as ArrayPath<ServiceFormValues>} control={form.control} label="Keywords" description="For search and AI mapping. (e.g., '360', 'cabina 360')" />
                        <ArrayFieldManager<ServiceFormValues>name={'qualifiers' as ArrayPath<ServiceFormValues>} control={form.control} label="Qualifier Questions" description="Questions the AI will ask for this service." />
                        <ArrayFieldManager<ServiceFormValues> name={'tags' as ArrayPath<ServiceFormValues>} control={form.control} label="Tags" description="For filtering on the public site." />
                     </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Photo Gallery Management</CardTitle>
                    <CardDescription>Provide a main Hero Image and optional gallery images.</CardDescription>
                </CardHeader>
                 <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="heroImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hero Image URL</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-4">
                                        <Input placeholder="https://example.com/image.jpg" {...field} />
                                        {field.value && (
                                            <Image src={field.value} alt="Hero Preview" width={80} height={45} className="rounded-md object-cover aspect-video" />
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="space-y-4">
                        <FormLabel>Additional Gallery Images</FormLabel>
                        {imageFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <FormField
                                    control={form.control}
                                    name={`galleryImages.${index}`}
                                    render={({ field }) => (
                                        <FormItem className="flex-grow">
                                            <FormControl>
                                                <Input placeholder="https://example.com/image.jpg" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeImage(index)}><X className="h-4 w-4"/></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => appendImage('')}>
                            <PlusCircle className="mr-2"/>Add Image URL
                        </Button>
                    </div>
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
                     <div className="flex items-center space-x-8">
                         <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5 mr-4">
                                    <FormLabel className="text-base">Active on Public Site</FormLabel>
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
                         <FormField
                            control={form.control}
                            name="featured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5 mr-4">
                                    <FormLabel className="text-base">Featured Service</FormLabel>
                                    <FormDescription>
                                        Show this service on the home page carousel.
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
                    </div>
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
// src/app/admin/services/[serviceId]/page.tsx

