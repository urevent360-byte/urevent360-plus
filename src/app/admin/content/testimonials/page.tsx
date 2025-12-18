
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, PlusCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const initialTestimonials = [
  {
    id: 1,
    rating: 5,
    text: '"UREVENT 360 transformed our wedding reception into an unforgettable experience. The 360 Photo Booth was a huge hit!"',
    author: 'Sarah Johnson',
    title: 'Wedding Planner',
  },
  {
    id: 2,
    rating: 5,
    text: '"The Magic Mirror brought so much joy to our company party. Everyone was talking about it for weeks!"',
    author: 'Michael Rodriguez',
    title: 'Corporate Event Manager',
  },
  {
    id: 3,
    rating: 5,
    text: '"La Hora Loca was exactly what we needed to energize our celebration. Professional and fun!"',
    author: 'Emma Chen',
    title: 'Birthday Party Organizer',
  },
];

type Testimonial = typeof initialTestimonials[0];

export default function TestimonialsContentPage() {
    const { toast } = useToast();
    const [testimonials, setTestimonials] = useState(initialTestimonials);
    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTestimonials(prev => prev.map(t => t.id === id ? {...t, [name]: value} : t));
    };
    
    const handleAddTestimonial = () => {
        const newId = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.id)) + 1 : 1;
        setTestimonials(prev => [...prev, {
            id: newId,
            rating: 5,
            text: '',
            author: '',
            title: ''
        }]);
    };

    const handleDeleteTestimonial = (id: number) => {
        setTestimonials(prev => prev.filter(t => t.id !== id));
    };

    const handleSave = async () => {
        setIsSaving(true);
        // In a real app, save the 'testimonials' array to your backend.
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        toast({
            title: "Testimonials Saved!",
            description: "Your client testimonials have been updated.",
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
                    <CardTitle>Manage Testimonials</CardTitle>
                    <CardDescription>Add, edit, or remove testimonials displayed on your home page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {testimonials.map(testimonial => (
                        <Card key={testimonial.id} className="p-4 relative">
                            <Button variant="destructive" size="icon" className="absolute top-4 right-4 h-7 w-7" onClick={() => handleDeleteTestimonial(testimonial.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`text-${testimonial.id}`}>Testimonial Text</Label>
                                    <Input id={`text-${testimonial.id}`} name="text" value={testimonial.text} onChange={(e) => handleInputChange(testimonial.id, e)} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`author-${testimonial.id}`}>Author</Label>
                                        <Input id={`author-${testimonial.id}`} name="author" value={testimonial.author} onChange={(e) => handleInputChange(testimonial.id, e)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`title-${testimonial.id}`}>Author&apos;s Title</Label>
                                        <Input id={`title-${testimonial.id}`} name="title" value={testimonial.title} onChange={(e) => handleInputChange(testimonial.id, e)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`rating-${testimonial.id}`}>Rating (1-5)</Label>
                                        <Input type="number" min="1" max="5" id={`rating-${testimonial.id}`} name="rating" value={testimonial.rating} onChange={(e) => handleInputChange(testimonial.id, e)} />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                    <Button variant="outline" onClick={handleAddTestimonial}>
                        <PlusCircle className="mr-2" />
                        Add New Testimonial
                    </Button>
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
