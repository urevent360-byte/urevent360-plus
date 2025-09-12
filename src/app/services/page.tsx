'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageProvider';
import { Button } from '@/components/ui/button';
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

export default function ServicesPage() {
  const { language } = useLanguage();

  const t = {
      title: { en: 'Our Services', es: 'Nuestros Servicios' },
      description: { en: 'Explore the wide range of services we offer to make your event unforgettable.', es: 'Explora la amplia gama de servicios que ofrecemos para que tu evento sea inolvidable.' },
      viewDetails: { en: 'View Details', es: 'Ver Detalles' }
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
          {t.title[language]}
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          {t.description[language]}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {placeholderServices.map((service) => (
          <Card key={service.slug} className="group overflow-hidden border-0 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2">
            <CardContent className="p-0">
              <div className="relative h-64 w-full">
                <Image
                  src={service.image}
                  alt={service.name[language]}
                  fill
                  className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="font-headline text-xl font-semibold text-primary">{service.name[language]}</h3>
                <p className="mt-2 text-foreground/80">{service.shortDescription[language]}</p>
                 <Button asChild className="mt-4" variant="outline">
                    <Link href={`/services/${service.slug}`}>
                        {t.viewDetails[language]} <ArrowRight className="ml-2" />
                    </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
