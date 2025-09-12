'use client';

import React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import placeholderImages from '@/lib/placeholder-images.json';
import type { PlaceholderImage } from '@/lib/types';
import { ExperienceCardContent } from './ExperienceCardContent';
import { Button } from '@/components/ui/button';
import { useOpenInquiryModal } from './InquiryModal';
import { useLanguage } from '@/contexts/LanguageProvider';
import { ArrowRight } from 'lucide-react';

const placeholderServices = [
    { 
        slug: '360-photo-booth',
        name: { en: '360 Photo Booth', es: 'Cabina de Fotos 360' },
        shortDescription: { en: 'Capture every angle of the fun with our 360-degree photo booth experience.', es: 'Captura cada ángulo de la diversión con nuestra experiencia de cabina de fotos de 360 grados.' },
        image: 'https://picsum.photos/seed/service1-1/800/600'
    },
    { 
        slug: 'magic-mirror',
        name: { en: 'Magic Mirror', es: 'Espejo Mágico' },
        shortDescription: { en: 'An interactive, full-length mirror that takes amazing selfies.', es: 'Un espejo interactivo de cuerpo entero que toma selfies increíbles.' },
        image: 'https://picsum.photos/seed/service2/800/600'
    },
    { 
        slug: 'la-hora-loca',
        name: { en: 'La Hora Loca', es: 'La Hora Loca' },
        shortDescription: { en: 'An hour of high-energy entertainment with dancers, props, and music.', es: 'Una hora de entretenimiento de alta energía con bailarines, accesorios y música.' },
        image: 'https://picsum.photos/seed/service3/800/600'
    },
    { 
        slug: 'cold-sparklers',
        name: { en: 'Cold Sparklers', es: 'Chispas Frías' },
        shortDescription: { en: 'Create a stunning pyrotechnic-like effect without the heat or smoke.', es: 'Crea un impresionante efecto pirotécnico sin calor ni humo.' },
        image: 'https://picsum.photos/seed/service4/800/600'
    },
];


export function ExperiencesCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );
  const { setOpen } = useOpenInquiryModal();
  const { language } = useLanguage();

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
                  <div className="relative h-64 w-full">
                      <Image
                        src={service.image}
                        alt={service.name[language]}
                        fill
                        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                  </div>
                  <div className="bg-card p-6">
                    <h3 className="font-headline text-xl font-semibold text-primary">
                        {service.name[language]}
                    </h3>
                    <p className="mt-2 text-foreground/80 h-12">{service.shortDescription[language]}</p>
                    <Button onClick={() => setOpen(true)} className="mt-4" variant="outline">
                        {language === 'en' ? 'Request Inquiry' : 'Solicitar Información'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
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
