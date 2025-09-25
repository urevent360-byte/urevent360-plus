
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
import { Tag, ShoppingCart, CheckCircle } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import servicesCatalog from '@/lib/services-catalog.json';
import Link from 'next/link';
import { useOpenInquiryModal } from '@/components/page/home/InquiryModal';

export default function ServiceDetailClient({ slug }: { slug: string }) {
    const service = servicesCatalog.services.find(s => s.slug === slug);
    const { toast } = useToast();
    const { addToCart } = useCart();
    const { setOpen: setInquiryOpen } = useOpenInquiryModal();


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
                    <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">{service.title} in Orlando</h1>
                    <p className="mt-4 text-lg text-foreground/80">{service.shortDescription}</p>
                    
                     <div className="mt-6 space-y-2">
                        {service.longDescription && <p className="text-foreground/80">{service.longDescription}</p>}
                    </div>

                    <Button onClick={handleAddToCart} size="lg" className="mt-8 bg-accent font-bold text-accent-foreground hover:bg-accent/90">
                        Add to Inquiry
                        <ShoppingCart className="ml-2" />
                    </Button>
                </div>
            </div>
            
            <Separator className="my-16" />

            <div className="max-w-4xl mx-auto">
                 <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary text-center">Why choose {service.title} for your event?</h2>
                 <div className="prose prose-lg mx-auto mt-6 text-foreground/80 text-justify">
                    <p>
                        Elevate your celebration with our premier {service.title} service, the perfect ingredient for an unforgettable event in Central Florida. Ideal for weddings, quinceañeras, and corporate functions, this experience is designed to leave a lasting impression on your guests. We pride ourselves on offering extensive customization options to seamlessly match your event's theme and atmosphere, ensuring a truly personal touch. Our professional on-site team handles every detail, guaranteeing a smooth and engaging experience from start to finish. Let us bring the 'wow' factor to your special day.
                    </p>
                 </div>
                 <div className="text-center mt-8">
                     <Button size="lg" onClick={() => setInquiryOpen(true)}>
                        <CheckCircle className="mr-2"/>
                        Check availability for your date
                    </Button>
                 </div>
            </div>

            {service.tags && service.tags.length > 0 && (
                 <div className="mt-16 text-center">
                    <h3 className="font-headline text-lg font-semibold flex items-center justify-center gap-2 mb-4"><Tag /> Tags</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {service.tags.map((tag: string) => (
                            <span key={tag} className="bg-secondary text-secondary-foreground text-sm font-medium px-3 py-1 rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
