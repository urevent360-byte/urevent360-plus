
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { listDesignProposals, type DesignProposal } from '@/lib/data-adapter';
import Image from 'next/image';
import { Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDesignsPage() {
    const [designs, setDesigns] = useState<DesignProposal[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchDesigns() {
            const fetchedDesigns = await listDesignProposals();
            setDesigns(fetchedDesigns);
        }
        fetchDesigns();
    }, []);

    const handleUpload = () => {
        // In a real app, this would open a file dialog and trigger an upload function.
        toast({
            title: 'Simulating Upload...',
            description: 'A new design proposal has been added to the list.',
        });
        const newDesign: DesignProposal = {
            id: `design-${Math.random().toString(36).substring(2, 9)}`,
            name: `New Custom Design ${designs.length + 1}`,
            imageUrl: `https://picsum.photos/seed/new${designs.length}/800/600`,
        };
        setDesigns(prev => [newDesign, ...prev]);
    };
    
    const handleDelete = (designId: string) => {
        toast({
            title: 'Design Deleted',
            description: 'The design proposal has been removed.',
            variant: 'destructive'
        });
        setDesigns(prev => prev.filter(d => d.id !== designId));
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Design Proposals</h1>
                    <p className="text-muted-foreground">Manage the design templates available for hosts to choose from.</p>
                </div>
                <Button onClick={handleUpload}>
                    <Upload className="mr-2" />
                    Upload New Design
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Available Designs</CardTitle>
                    <CardDescription>
                        These are the designs that will be presented to the host when they click "View Design" in their portal.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {designs.map(design => (
                        <Card key={design.id} className="group overflow-hidden">
                             <div className="relative aspect-[4/3]">
                                <Image src={design.imageUrl} alt={design.name} fill className="object-cover" />
                                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(design.id)}>
                                        <Trash2 />
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold truncate">{design.name}</h3>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
