
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const initialContent = {
    title: "About UREVENT 360",
    subtitle: "Crafting Unforgettable Moments, One Event at a Time",
    paragraph1: "At UREVENT 360, we believe every event is an opportunity to create lasting memories. We are a passionate team dedicated to transforming your visions into spectacular realities. With years of experience in event planning and entertainment, we bring creativity, professionalism, and a touch of magic to every celebration.",
    paragraph2: "Our mission is to provide seamless, stress-free event experiences that exceed expectations. From intimate gatherings to grand corporate affairs, we handle every detail with precision and care, ensuring your event is not just successful, but truly unforgettable. Let us bring your dream event to life!",
    missionTitle: "Our Mission",
    missionText: "To deliver exceptional event experiences through innovative solutions and unparalleled service.",
    visionTitle: "Our Vision",
    visionText: "To be the leading event planning and entertainment provider, known for creativity, reliability, and client satisfaction."
};


export default function AboutPageContent() {
    const { toast } = useToast();
    const [content, setContent] = useState(initialContent);
    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContent(prev => ({...prev, [name]: value}));
    };

     const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        toast({
            title: "Content Saved!",
            description: "Your About Us page content has been updated.",
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

            <Card>
                <CardHeader>
                    <CardTitle>About Us Page Content</CardTitle>
                    <CardDescription>Edit all text content for the About Us section on your landing page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Main Title</Label>
                        <Textarea id="title" name="title" value={content.title} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Textarea id="subtitle" name="subtitle" value={content.subtitle} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="paragraph1">Main Paragraph 1</Label>
                        <Textarea id="paragraph1" name="paragraph1" value={content.paragraph1} className="min-h-32" onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="paragraph2">Main Paragraph 2</Label>
                        <Textarea id="paragraph2" name="paragraph2" value={content.paragraph2} className="min-h-32" onChange={handleInputChange} />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="missionText">Mission Statement</Label>
                            <Textarea id="missionText" name="missionText" value={content.missionText} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="visionText">Vision Statement</Label>
                            <Textarea id="visionText" name="visionText" value={content.visionText} onChange={handleInputChange} />
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <div className="flex justify-end gap-2 mt-8">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save All Changes'}
                </Button>
            </div>
        </div>
    )
}
