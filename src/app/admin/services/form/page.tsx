'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Placeholder data for an existing service being edited
const existingService = {
    name: '360 Photo Booth',
    shortDescription: 'Capture every angle of the fun with our 360-degree photo booth experience.',
    longDescription: 'Our 360 photo booth is the ultimate party centerpiece. Guests stand on a platform while a camera revolves around them, creating stunning, dynamic video clips perfect for social media. We provide props, instant sharing capabilities, and a professional attendant to ensure everything runs smoothly.',
    category: 'Photo Booth',
    keywords: '360 photo booth, video booth, event entertainment, social media booth',
    images: [
        { url: 'https://picsum.photos/seed/service1-1/800/600', alt: 'Guests enjoying the 360 photo booth' },
        { url: 'https://picsum.photos/seed/service1-2/800/600', alt: 'Close-up of the 360 camera setup' },
    ]
};


export default function ServiceFormPage() {
    // In a real app, you'd use a hook like useSearchParams to get the ID and fetch service data.
    // For now, we'll just use the placeholder data as if we're editing.
    const isEditing = true; 

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

        <form className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Service' : 'Add New Service'}</CardTitle>
                    <CardDescription>Fill out the details for the service below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="service-name">Service Name</Label>
                        <Input id="service-name" defaultValue={isEditing ? existingService.name : ''} placeholder="e.g., Magic Mirror" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select defaultValue={isEditing ? existingService.category : undefined}>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Photo Booth">Photo Booth</SelectItem>
                                <SelectItem value="Entertainment">Entertainment</SelectItem>
                                <SelectItem value="Special Effects">Special Effects</SelectItem>
                                <SelectItem value="Decor">Decor</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="short-description">Short Description</Label>
                        <Textarea id="short-description" defaultValue={isEditing ? existingService.shortDescription : ''} placeholder="A brief, catchy description for service cards." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="long-description">Long Description</Label>
                        <Textarea id="long-description" className="min-h-32" defaultValue={isEditing ? existingService.longDescription : ''} placeholder="A detailed description for the service page." />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="keywords">SEO Keywords / Tags</Label>
                        <Input id="keywords" defaultValue={isEditing ? existingService.keywords : ''} placeholder="e.g., quinceañera entertainment, LED robot" />
                        <p className="text-sm text-muted-foreground">Separate keywords with a comma.</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Photo / Gallery Management</CardTitle>
                    <CardDescription>Upload, replace, or delete images for this service.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {isEditing && existingService.images.map((image, index) => (
                            <div key={index} className="relative group border rounded-lg p-2 space-y-2">
                                <Image
                                    src={image.url}
                                    alt={image.alt}
                                    width={400}
                                    height={300}
                                    className="rounded-md aspect-[4/3] object-cover w-full"
                                />
                                <div className="space-y-1">
                                     <Label htmlFor={`alt-text-${index}`} className="text-xs">Alt Text</Label>
                                     <Input id={`alt-text-${index}`} defaultValue={image.alt} placeholder="Describe the image"/>
                                </div>
                                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="destructive" className="h-8 w-8">
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </div>
                            </div>
                        ))}
                         <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted aspect-[4/3]">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground text-center">Click to upload or drag & drop</p>
                            </div>
                            <input id="image-upload" type="file" className="hidden" multiple />
                        </label>
                    </div>
                </CardContent>
            </Card>
             <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>{isEditing ? 'Save Changes' : 'Create Service'}</Button>
            </div>
        </form>
    </div>
  );
}
