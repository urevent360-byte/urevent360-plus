
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const contentSections = [
    { 
        title: 'Home Page', 
        description: 'Edit the hero banner, featured services, and other landing page content.',
        link: '/admin/content/home'
    },
    { 
        title: 'About Us Page', 
        description: 'Update the text and images on the "About Us / Sobre Nosotros" section.',
        link: '/admin/content/about'
    },
    { 
        title: 'Testimonials', 
        description: 'Add, edit, or remove client testimonials.',
        link: '/admin/content/testimonials'
    },
    {
        title: 'Footer Content',
        description: 'Manage contact information and social media links in the footer.',
        link: '/admin/content/footer'
    },
    {
        title: 'Branding',
        description: 'Manage your logo and hero background image.',
        link: '/admin/content/branding'
    }
];

export default function ContentManagementPage() {
  return (
    <div>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
                <p className="text-muted-foreground">Update your website's text, images, and other content.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentSections.map((section) => (
                 <Card key={section.title}>
                    <CardHeader>
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline">
                            <Link href={section.link}>
                                Edit Section <ArrowRight className="ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
