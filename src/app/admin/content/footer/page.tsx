
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { updateFooterAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import footerData from '@/lib/footer-data.json';

const footerFormSchema = z.object({
  email1: z.string().email('Please enter a valid email.').or(z.literal('')),
  email2: z.string().email('Please enter a valid email.').or(z.literal('')),
  phone1: z.string().min(1, 'Phone number is required.'),
  phone2: z.string().min(1, 'Spanish phone number is required.'),
  instagram: z.string().url('Please enter a valid URL.').or(z.literal('')),
  facebook: z.string().url('Please enter a valid URL.').or(z.literal('')),
  twitter: z.string().url('Please enter a valid URL.').or(z.literal('')),
});

type FooterFormValues = z.infer<typeof footerFormSchema>;

export default function FooterContentPage() {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<FooterFormValues>({
        resolver: zodResolver(footerFormSchema),
        defaultValues: {
          email1: footerData.contact.emails[0]?.address || '',
          email2: footerData.contact.emails[1]?.address || '',
          phone1: footerData.contact.phones[0]?.number || '',
          phone2: footerData.contact.phones[1]?.number || '',
          instagram: footerData.social.instagram || '',
          facebook: footerData.social.facebook || '',
          twitter: footerData.social.twitter || '',
        },
    });
    
    async function onSubmit(data: FooterFormValues) {
        const result = await updateFooterAction(data);
        if (result.success) {
            toast({
                title: 'Footer Updated!',
                description: 'Your footer content has been successfully saved.',
            });
            router.refresh();
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
                <Link href="/admin/content">
                    <ArrowLeft className="mr-2" />
                    Back to Content
                </Link>
            </Button>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Footer Content</CardTitle>
                    <CardDescription>Update the contact information and social media links displayed in your website's footer.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <h3 className="font-semibold text-lg">Contact Information</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField
                            control={form.control}
                            name="email1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><Mail /> Primary Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="urevent360@gmail.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="email2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><Mail /> Secondary Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="info@urevent360.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="phone1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><Phone /> Main Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="(689) 302-5502" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="phone2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><Phone /> Spanish Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="(407) 533-0970 (Español)" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <h3 className="font-semibold text-lg mt-6">Social Media Links</h3>
                     <div className="space-y-4">
                         <FormField
                            control={form.control}
                            name="instagram"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><Instagram /> Instagram URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://instagram.com/yourprofile" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="facebook"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><Facebook /> Facebook URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://facebook.com/yourpage" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="twitter"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><Twitter /> Twitter URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://twitter.com/yourhandle" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>


             <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
        </Form>
    </div>
  );
}
