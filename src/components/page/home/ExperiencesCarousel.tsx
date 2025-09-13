'use client';

import React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';

const placeholderServices = [
    { 
        slug: '360-photo-booth',
        name: '360 Photo Booth',
        shortDescription: 'A modern platform where guests can record dynamic, slow-motion videos with a rotating camera.',
        image: 'https://picsum.photos/seed/service1/800/600',
    },
    { 
        slug: 'photo-booth-printer',
        name: 'Photo Booth Printer',
        shortDescription: 'Receive glossy, high-quality photo strips instantly with custom logos and designs.',
        image: 'https://picsum.photos/seed/service2/800/600',
    },
    {
        slug: 'magic-mirror',
        name: 'Magic Mirror',
        shortDescription: 'An interactive, full-length mirror that takes amazing selfies with fun animations.',
        image: 'https://picsum.photos/seed/service3/800/600',
    },
    { 
        slug: 'la-hora-loca-led-robot',
        name: 'La Hora Loca with LED Robot',
        shortDescription: 'An epic hour of high-energy entertainment with a giant LED robot, dancers, and CO2 jets.',
        image: 'https://picsum.photos/seed/service4/800/600',
    },
    { 
        slug: 'cold-sparklers',
        name: 'Cold Sparklers',
        shortDescription: 'Create a stunning, safe pyrotechnic-like effect for magical moments without heat or smoke.',
        image: 'https://picsum.photos/seed/service5/800/600',
    },
    { 
        slug: 'dance-on-the-clouds',
        name: 'Dance on the Clouds',
        shortDescription: 'A dreamy, thick cloud effect that covers the dance floor for a fairy-tale first dance.',
        image: 'https://picsum.photos/seed/service6/800/600',
    },
    { 
        slug: 'projector-slideshows-videos',
        name: 'Projector (Slideshows & Videos)',
        shortDescription: 'Display slideshows and videos on a large screen for an emotional and personal touch.',
        image: 'https://picsum.photos/seed/service7/800/600',
    },
    { 
        slug: 'monogram-projector',
        name: 'Monogram Projector',
        shortDescription: 'Project a custom, glowing monogram of initials or designs onto the dance floor or wall.',
        image: 'https://picsum.photos/seed/service8/800/600',
    },
    { 
        slug: 'led-screens-wall',
        name: 'LED Screens Wall',
        shortDescription: 'A massive LED screen wall for vibrant visuals, animations, and a futuristic event look.',
        image: 'https://picsum.photos/seed/service9/800/600',
    }
];


export function ExperiencesCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (service: typeof placeholderServices[0]) => {
    addToCart({
      slug: service.slug,
      name: service.name,
      image: service.image,
    });
    toast({
      title: 'Added to cart!',
      description: `${service.name} has been added to your inquiry cart.`,
    });
  };

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      opts={{
        align: 'start',
        loop: true,
      }}
    >
      <CarouselContent className="-ml-4">
        {placeholderServices.map((service, index) => (
          <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card
                className="group overflow-hidden border-0 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2"
              >
                <CardContent className="p-0">
                  <Link href={`/services/${service.slug}`} className="block">
                    <div className="relative h-64 w-full">
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                  </Link>
                  <div className="bg-white p-6">
                    <h3 className="font-headline text-xl font-semibold text-primary">
                        {service.name}
                    </h3>
                    <p className="mt-2 text-gray-700 min-h-[72px]">{service.shortDescription}</p>
                    <div className="mt-4 flex gap-2">
                        <Button asChild className="flex-1" variant="outline">
                            <Link href={`/services/${service.slug}`}>
                                View Details
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button onClick={() => handleAddToCart(service)} className="flex-1">
                             <ShoppingCart className="mr-2"/>
                            Add to Cart
                        </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10" />
      <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10" />
    </Carousel>
  );
}
