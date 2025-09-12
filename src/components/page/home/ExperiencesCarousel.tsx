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
import { useLanguage } from '@/contexts/LanguageProvider';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';

const placeholderServices = [
    { 
        slug: '360-photo-booth',
        name: { en: '360 Photo Booth', es: 'Cabina de Fotos 360' },
        shortDescription: { en: 'A modern platform where guests can record dynamic, slow-motion videos with a rotating camera.', es: 'Una moderna plataforma donde los invitados pueden grabar videos dinámicos en cámara lenta con una cámara giratoria.' },
        image: 'https://picsum.photos/seed/service1/800/600',
    },
    { 
        slug: 'photo-booth-printer',
        name: { en: 'Photo Booth Printer', es: 'Impresora para Cabina de Fotos' },
        shortDescription: { en: 'Receive glossy, high-quality photo strips instantly with custom logos and designs.', es: 'Recibe tiras de fotos brillantes y de alta calidad al instante con logos y diseños personalizados.' },
        image: 'https://picsum.photos/seed/service2/800/600',
    },
    {
        slug: 'magic-mirror',
        name: { en: 'Magic Mirror', es: 'Espejo Mágico' },
        shortDescription: { en: 'An interactive, full-length mirror that takes amazing selfies with fun animations.', es: 'Un espejo interactivo de cuerpo entero que toma selfies increíbles con animaciones divertidas.' },
        image: 'https://picsum.photos/seed/service3/800/600',
    },
    { 
        slug: 'la-hora-loca-led-robot',
        name: { en: 'La Hora Loca with LED Robot', es: 'La Hora Loca con Robot LED' },
        shortDescription: { en: 'An epic hour of high-energy entertainment with a giant LED robot, dancers, and CO2 jets.', es: 'Una hora épica de entretenimiento de alta energía con un robot LED gigante, bailarines y chorros de CO2.' },
        image: 'https://picsum.photos/seed/service4/800/600',
    },
    { 
        slug: 'cold-sparklers',
        name: { en: 'Cold Sparklers', es: 'Chispas Frías' },
        shortDescription: { en: 'Create a stunning, safe pyrotechnic-like effect for magical moments without heat or smoke.', es: 'Crea un impresionante y seguro efecto pirotécnico para momentos mágicos sin calor ni humo.' },
        image: 'https://picsum.photos/seed/service5/800/600',
    },
    { 
        slug: 'dance-on-the-clouds',
        name: { en: 'Dance on the Clouds', es: 'Baile en las Nubes' },
        shortDescription: { en: 'A dreamy, thick cloud effect that covers the dance floor for a fairy-tale first dance.', es: 'Un efecto de nube densa y soñadora que cubre la pista de baile para un primer baile de cuento de hadas.' },
        image: 'https://picsum.photos/seed/service6/800/600',
    },
    { 
        slug: 'projector-slideshows-videos',
        name: { en: 'Projector (Slideshows & Videos)', es: 'Proyector (Presentaciones y Videos)' },
        shortDescription: { en: 'Display slideshows and videos on a large screen for an emotional and personal touch.', es: 'Muestra presentaciones de diapositivas y videos en una pantalla grande para un toque emocional y personal.' },
        image: 'https://picsum.photos/seed/service7/800/600',
    },
    { 
        slug: 'monogram-projector',
        name: { en: 'Monogram Projector', es: 'Proyector de Monograma' },
        shortDescription: { en: 'Project a custom, glowing monogram of initials or designs onto the dance floor or wall.', es: 'Proyecta un monograma personalizado y brillante con iniciales o diseños en la pista de baile o en la pared.' },
        image: 'https://picsum.photos/seed/service8/800/600',
    },
    { 
        slug: 'led-screens-wall',
        name: { en: 'LED Screens Wall', es: 'Pared de Pantallas LED' },
        shortDescription: { en: 'A massive LED screen wall for vibrant visuals, animations, and a futuristic event look.', es: 'Una pared masiva de pantallas LED para visuales vibrantes, animaciones y un aspecto futurista para tu evento.' },
        image: 'https://picsum.photos/seed/service9/800/600',
    }
];


export function ExperiencesCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (service: typeof placeholderServices[0]) => {
    addToCart({
      slug: service.slug,
      name: service.name.en,
      image: service.image,
    });
    toast({
      title: 'Added to cart!',
      description: `${service.name[language]} has been added to your inquiry cart.`,
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
                          alt={service.name[language]}
                          fill
                          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                  </Link>
                  <div className="bg-white p-6">
                    <h3 className="font-headline text-xl font-semibold text-primary">
                        {service.name[language]}
                    </h3>
                    <p className="mt-2 text-gray-700 h-12">{service.shortDescription[language]}</p>
                    <div className="mt-4 flex gap-2">
                        <Button asChild className="flex-1" variant="outline">
                            <Link href={`/services/${service.slug}`}>
                                {language === 'en' ? 'View Details' : 'Ver Detalles'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button onClick={() => handleAddToCart(service)} className="flex-1">
                             <ShoppingCart className="mr-2"/>
                            {language === 'en' ? 'Add to Cart' : 'Añadir'}
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
