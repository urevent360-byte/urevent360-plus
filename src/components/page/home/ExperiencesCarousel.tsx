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

const experienceImages = placeholderImages.placeholderImages.filter(p =>
  p.id.startsWith('experience-')
);

const experiences: {
  title: { en: string; es: string };
  description: { en: string; es: string };
  image: PlaceholderImage | undefined;
}[] = [
  {
    title: { en: 'Weddings & Anniversaries', es: 'Bodas y Aniversarios' },
    description: {
      en: 'Crafting magical moments for your special day.',
      es: 'Creando momentos mágicos para tu día especial.',
    },
    image: experienceImages[0],
  },
  {
    title: { en: 'Corporate Events', es: 'Eventos Corporativos' },
    description: {
      en: 'Professional and seamless events that impress.',
      es: 'Eventos profesionales e impecables que impresionan.',
    },
    image: experienceImages[1],
  },
  {
    title: { en: 'Parties & Celebrations', es: 'Fiestas y Celebraciones' },
    description: {
      en: 'Unforgettable parties for any occasion.',
      es: 'Fiestas inolvidables para cualquier ocasión.',
    },
    image: experienceImages[2],
  },
  {
    title: { en: 'Festivals & Concerts', es: 'Festivales y Conciertos' },
    description: {
      en: 'Large-scale events managed with expertise.',
      es: 'Eventos a gran escala gestionados con pericia.',
    },
    image: experienceImages[3],
  },
  // Add more experiences if needed to have more items in the carousel
  {
    title: { en: 'Quinceañeras', es: 'Quinceañeras' },
    description: {
      en: 'A magical celebration for a special milestone.',
      es: 'Una celebración mágica para un hito especial.',
    },
    image: placeholderImages.placeholderImages.find(p => p.id === 'gallery-1'),
  },
  {
    title: { en: 'Private Dinners', es: 'Cenas Privadas' },
    description: {
      en: 'Intimate and elegant dining experiences.',
      es: 'Experiencias gastronómicas íntimas y elegantes.',
    },
    image: placeholderImages.placeholderImages.find(p => p.id === 'gallery-4'),
  },
];

export function ExperiencesCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

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
        {experiences.map((exp, index) => (
          <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <div className="p-1">
              <Card
                className="group overflow-hidden border-0 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2"
              >
                <CardContent className="p-0">
                  <div className="relative h-64 w-full">
                    {exp.image && (
                      <Image
                        src={exp.image.imageUrl}
                        alt={exp.image.description}
                        fill
                        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                        data-ai-hint={exp.image.imageHint}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="bg-card p-6">
                    <ExperienceCardContent
                      title={exp.title}
                      description={exp.description}
                    />
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
