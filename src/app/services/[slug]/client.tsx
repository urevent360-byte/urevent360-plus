
'use client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Tag, ShoppingCart, Video, Check } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import servicesCatalog from '@/lib/services-catalog.json';
import Link from 'next/link';

export default function ServiceDetailClient({ slug }: { slug: string }) {
    const service = servicesCatalog.services.find(s => s.slug === slug);
    const { toast } = useToast();
    const { addToCart } = useCart();


    if (!service) {
        notFound();
    }
    
    const handleAddToCart = () => {
        addToCart({
            slug: service.id,
            name: service.title,
            image: service.heroImage || ''
        });
        toast({
            title: 'Added to inquiry cart!',
            description: `${service.title} has been added to your inquiry cart.`,
        });
    }

    const allImages = [service.heroImage, ...(service.galleryImages || [])];

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div>
                     <Carousel className="w-full shadow-lg rounded-lg overflow-hidden">
                        <CarouselContent>
                            {allImages.map((imgUrl, index) => (
                            <CarouselItem key={index}>
                                <div className="relative aspect-video">
                                <Image
                                    src={imgUrl}
                                    alt={`${service.title} image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />
                                </div>
                            </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="ml-16" />
                        <CarouselNext className="mr-16" />
                    </Carousel>
                </div>
                <div>
                    <Button variant="outline" size="sm" asChild className="mb-4">
                       <Link href="/services">
                         Back to Services
                       </Link>
                    </Button>
                    <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">{service.title}</h1>
                    <p className="mt-4 text-lg text-foreground/80">{service.shortDescription}</p>
                    
                     <div className="mt-6 space-y-2">
                        {service.longDescription && <p className="text-foreground/80">{service.longDescription}</p>}
                    </div>

                    <div className="mt-8">
                        <h3 className="font-headline text-lg font-semibold flex items-center gap-2"><Tag /> Tags</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {service.tags?.map((tag: string) => (
                                <span key={tag} className="bg-secondary text-secondary-foreground text-sm font-medium px-3 py-1 rounded-full">{tag}</span>
                            ))}
                        </div>
                    </div>

                    <Button onClick={handleAddToCart} size="lg" className="mt-8 bg-accent font-bold text-accent-foreground hover:bg-accent/90">
                        Add to Inquiry
                        <ShoppingCart className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
