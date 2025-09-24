
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

// In a real app, this data would be fetched from a CMS or a JSON file.
const initialContent = {
    heroTitle: "Unforgettable Events, Perfectly Planned.",
    heroSubtitle: "UREVENT 360 PLUS brings your vision to life with passion, creativity, and precision. Let's create memories together.",
    heroButtonText: "Request an Inquiry",
    experiencesTitle: "Our Experiences",
    experiencesSubtitle: "From intimate gatherings to grand celebrations, we specialize in creating bespoke events that reflect your unique style.",
};

export default function HomePageContent() {
    const { toast } = useToast();
    const [content, setContent] = useState(initialContent);
    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContent(prev => ({...prev, [name]: value}));
    };

    const handleSave = async () => {
        setIsSaving(true);
        // In a real app, you would save this 'content' object to your backend.
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        toast({
            title: "Content Saved!",
            description: "Your home page content has been updated.",
        });
    };

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

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Hero Section</CardTitle>
                    <CardDescription>Update the main headline and introductory text on your home page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="heroTitle">Main Headline</Label>
                        <Input id="heroTitle" name="heroTitle" value={content.heroTitle} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="heroSubtitle">Sub-headline</Label>
                        <Textarea id="heroSubtitle" name="heroSubtitle" value={content.heroSubtitle} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="heroButtonText">Button Text</Label>
                        <Input id="heroButtonText" name="heroButtonText" value={content.heroButtonText} onChange={handleInputChange} />
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Experiences Section</CardTitle>
                    <CardDescription>Update the title and subtitle for the services/experiences section.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="experiencesTitle">Section Title</Label>
                        <Input id="experiencesTitle" name="experiencesTitle" value={content.experiencesTitle} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="experiencesSubtitle">Section Subtitle</Label>
                        <Textarea id="experiencesSubtitle" name="experiencesSubtitle" value={content.experiencesSubtitle} onChange={handleInputChange} />
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="flex justify-end gap-2 mt-8">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save All Changes'}
            </Button>
        </div>
    </div>
  );
}
