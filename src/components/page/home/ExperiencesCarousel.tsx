
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
import servicesCatalog from '@/lib/services-catalog.json';

const placeholderServices = servicesCatalog.services.filter(s => s.featured);

export function ExperiencesCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (service: typeof placeholderServices[0]) => {
    addToCart({
      slug: service.id,
      name: service.title,
      image: service.heroImage || '',
    });
    toast({
      title: 'Added to cart!',
      description: `${service.title} has been added to your inquiry cart.`,
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
                          src={service.heroImage}
                          alt={service.title}
                          fill
                          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                  </Link>
                  <div className="bg-white p-6">
                    <h3 className="font-headline text-xl font-semibold text-primary">
                        {service.title}
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
