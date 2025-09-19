
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { listDesignProposals, approveDesign, type DesignProposal } from '@/lib/data-adapter';
import type { Event } from '@/lib/data-adapter';
import Image from 'next/image';
import { Check, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Hardcoded for prototype. In a real app, this would be fetched based on the user.
const eventId = 'evt-456'; 

export default function HostDesignsPage() {
    const [designs, setDesigns] = useState<DesignProposal[]>([]);
    const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchDesigns() {
            const fetchedDesigns = await listDesignProposals();
            setDesigns(fetchedDesigns);
        }
        fetchDesigns();
    }, []);

    const handleSelectDesign = async (designId: string) => {
        setSelectedDesignId(designId);
        setIsSaving(true);
        
        await approveDesign(eventId, designId);

        toast({
            title: 'Design Approved!',
            description: 'Your design selection has been saved and sent to our team.',
        });
        setIsSaving(false);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Choose Your Design</h1>
                    <p className="text-muted-foreground">Select the photo strip design for your event.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Available Designs</CardTitle>
                    <CardDescription>
                        Click on a design to select it. Your selection will be automatically saved and our team will be notified.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {designs.map(design => {
                        const isSelected = selectedDesignId === design.id;
                        return (
                            <Card 
                                key={design.id} 
                                className={cn(
                                    "group overflow-hidden cursor-pointer transition-all",
                                    isSelected && "ring-2 ring-primary ring-offset-2",
                                    isSaving && !isSelected && "opacity-50"
                                )}
                                onClick={() => !isSaving && handleSelectDesign(design.id)}
                            >
                                <div className="relative aspect-[4/3]">
                                    <Image src={design.imageUrl} alt={design.name} fill className="object-cover" />
                                    {isSelected && (
                                         <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
                                            <CheckCircle className="h-16 w-16 text-primary-foreground" />
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold truncate">{design.name}</h3>
                                </CardContent>
                            </Card>
                        )
                    })}
                    {designs.length === 0 && (
                        <div className="col-span-full text-center text-muted-foreground py-16">
                            <ImageIcon className="mx-auto h-12 w-12 mb-4"/>
                            <p>No design proposals have been uploaded by the admin yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
