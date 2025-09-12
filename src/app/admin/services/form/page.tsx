'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, ArrowLeft, Video } from 'lucide-react';
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
import { createServiceAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const serviceFormSchema = z.object({
  name: z.string().min(2, 'Service name is required.'),
  category: z.string().min(1, 'Category is required.'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters.'),
  longDescription: z.string().min(20, 'Long description must be at least 20 characters.'),
  metaTitle: z.string().min(5, 'SEO title is required.'),
  metaDescription: z.string().min(10, 'SEO description is required.'),
  keywords: z.string().min(1, 'Please add at least one keyword.'),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().min(2, 'Alt text is required.'),
  })),
  videos: z.array(z.object({
    url: z.string().url(),
    alt: z.string().min(2, 'Alt text is required.'),
  })).optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

// Placeholder data for an existing service being edited
const existingService: ServiceFormValues = {
    name: '360 Photo Booth',
    shortDescription: 'Capture every angle of the fun with our 360-degree photo booth experience.',
    longDescription: 'Our 360 photo booth is the ultimate party centerpiece. Guests stand on a platform while a camera revolves around them, creating stunning, dynamic video clips perfect for social media. We provide props, instant sharing capabilities, and a professional attendant to ensure everything runs smoothly.',
    category: 'Photo Booth',
    metaTitle: '360 Photo Booth Rental | UREVENT 360 PLUS',
    metaDescription: 'Rent the best 360 photo booth for your wedding, party, or corporate event. Create amazing slow-motion videos for social media.',
    keywords: '360 photo booth, video booth, event entertainment, social media booth',
    images: [
        { url: 'https://picsum.photos/seed/service1-1/800/600', alt: 'Guests enjoying the 360 photo booth' },
        { url: 'https://picsum.photos/seed/service1-2/800/600', alt: 'Close-up of the 360 camera setup' },
    ],
    videos: [
        { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', alt: 'Sample video of the 360 photo booth in action' }
    ]
};

export default function ServiceFormPage() {
    const isEditing = true; // Placeholder for edit mode detection
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceFormSchema),
        defaultValues: isEditing ? existingService : {
            name: '',
            category: '',
            shortDescription: '',
            longDescription: '',
            metaTitle: '',
            metaDescription: '',
            keywords: '',
            images: [],
            videos: [],
        },
    });

    const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
        control: form.control,
        name: 'images',
    });

    const { fields: videoFields, append: appendVideo, remove: removeVideo } = useFieldArray({
        control: form.control,
        name: 'videos',
    });
    
    async function onSubmit(data: ServiceFormValues) {
        const result = await createServiceAction(data);
        if (result.success) {
            toast({
                title: 'Service Saved!',
                description: `The service "${data.name}" has been successfully saved.`,
            });
            router.push('/admin/services');
        } else {
            toast({
                title: 'Error',
                description: result.message || 'An unknown error occurred.',
                variant: 'destructive',
            });
        }
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
                    <CardDescription>Fill out the details for the service below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Service Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Magic Mirror" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                        <SelectItem value="Photo Booth">Photo Booth</SelectItem>
                                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                                        <SelectItem value="Special Effects">Special Effects</SelectItem>
                                        <SelectItem value="Decor">Decor</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                    <Textarea className="min-h-32" placeholder="A detailed description for the service page." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>SEO & Discoverability</CardTitle>
                    <CardDescription>Optimize how this service appears on search engines.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <FormField
                        control={form.control}
                        name="metaTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>SEO Meta Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Title for search engine results" {...field} />
                                </FormControl>
                                <FormDescription>Appears in the browser tab and search results. Keep it concise.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="metaDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>SEO Meta Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="A short summary for search engine results." {...field} />
                                </FormControl>
                                <FormDescription>Briefly describe this service (approx. 155-160 characters).</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="keywords"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>SEO Keywords / Tags</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., quinceañera entertainment, LED robot" {...field} />
                                </FormControl>
                                <FormDescription>Separate keywords with a comma.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                    className="rounded-md aspect-[4/3] object-cover w-full"
                                />
                                <FormField
                                    control={form.control}
                                    name={`images.${index}.alt`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Alt Text</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Describe the image" {...field}/>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => removeImage(index)}>
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

            <Card>
                <CardHeader>
                    <CardTitle>Video Management</CardTitle>
                    <CardDescription>Add, replace, or delete videos for this service (e.g., YouTube embed links).</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {videoFields.map((video, index) => (
                            <div key={video.id} className="relative group border rounded-lg p-2 space-y-2">
                               <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                                 {video.url.includes('youtube.com') || video.url.includes('youtu.be') ? (
                                    <iframe
                                        src={video.url.replace('watch?v=', 'embed/')}
                                        title={video.alt}
                                        className="w-full h-full rounded-md"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                    ) : (
                                        <div className="text-center text-muted-foreground p-4">
                                            <Video className="w-8 h-8 mx-auto mb-2" />
                                            <p className="text-xs">Video preview not available. Ensure it's a valid embed URL.</p>
                                        </div>
                                    )}
                               </div>
                                <FormField
                                    control={form.control}
                                    name={`videos.${index}.url`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Video URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://youtube.com/embed/..." {...field}/>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`videos.${index}.alt`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Alt Text / Description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Describe the video" {...field}/>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => removeVideo(index)}>
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Delete Video</span>
                                    </Button>
                                </div>
                            </div>
                        ))}
                         <div
                            className="flex flex-col items-center justify-center w-full min-h-[300px] border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
                             onClick={() => appendVideo({ url: '', alt: ''})}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Video className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground text-center">Click to add a new video</p>
                            </div>
                        </div>
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
