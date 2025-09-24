
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

export default function ServiceDetailClient({ slug }: { slug: string }) {
    const service = servicesCatalog.services.find(s => s.id === slug);
    const { toast } = useToast();
    const { addToCart } = useCart();


    if (!service) {
        notFound();
    }
    
    const handleAddToCart = () => {
        addToCart({
            slug: service.id,
            name: service.label,
            image: service.images[0]?.url || ''
        });
        toast({
            title: 'Added to inquiry cart!',
            description: `${service.label} has been added to your inquiry cart.`,
        });
    }

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                     <Carousel className="w-full">
                        <CarouselContent>
                            {service.images.map((img, index) => (
                            <CarouselItem key={index}>
                                <div className="relative aspect-video">
                                <Image
                                    src={img.url}
                                    alt={img.alt}
                                    fill
                                    className="object-cover rounded-lg shadow-lg"
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
                    <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">{service.label}</h1>
                    <p className="mt-4 text-lg text-foreground/80">{service.shortDescription}</p>
                    
                    <div className="mt-6 space-y-2">
                        <h3 className="font-headline text-lg font-semibold">Key Features</h3>
                        <ul className="space-y-2">
                            {service.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-green-500 mt-1 shrink-0"/>
                                    <span className="text-foreground/80">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-8">
                        <h3 className="font-headline text-lg font-semibold flex items-center gap-2"><Tag /> Keywords</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {service.keywords.map((keyword: string) => (
                                <span key={keyword} className="bg-secondary text-secondary-foreground text-sm font-medium px-3 py-1 rounded-full">{keyword}</span>
                            ))}
                        </div>
                    </div>

                    <Button onClick={handleAddToCart} size="lg" className="mt-8 bg-accent font-bold text-accent-foreground hover:bg-accent/90">
                        Add to Inquiry
                        <ShoppingCart className="ml-2" />
                    </Button>
                </div>
            </div>

            {service.videos && service.videos.length > 0 && (
                <div className="mt-16 md:mt-24">
                    <Separator />
                    <div className="text-center my-12">
                        <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl flex items-center justify-center gap-3">
                           <Video /> See It In Action
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {service.videos.map((video, index) => (
                            <div key={index} className="aspect-video">
                                <iframe
                                    src={video.url}
                                    title={video.alt}
                                    className="w-full h-full rounded-lg shadow-lg"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

