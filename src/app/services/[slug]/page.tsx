'use client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Link from 'next/link';
import { Mail, Tag } from 'lucide-react';

const placeholderServicesData: any = {
    '360-photo-booth': {
        slug: '360-photo-booth',
        name: { en: '360 Photo Booth', es: 'Cabina de Fotos 360' },
        longDescription: { en: 'Our 360 photo booth is the ultimate party centerpiece. Guests stand on a platform while a camera revolves around them, creating stunning, dynamic video clips perfect for social media. We provide props, instant sharing capabilities, and a professional attendant to ensure everything runs smoothly.', es: 'Nuestra cabina de fotos 360 es el centro de atención definitivo para la fiesta. Los invitados se paran en una plataforma mientras una cámara gira a su alrededor, creando videoclips dinámicos e impresionantes perfectos para las redes sociales. Proporcionamos accesorios, capacidades para compartir instantáneamente y un asistente profesional para garantizar que todo funcione sin problemas.' },
        images: [
            'https://picsum.photos/seed/service1-1/800/600',
            'https://picsum.photos/seed/service1-2/800/600',
            'https://picsum.photos/seed/service1-3/800/600',
        ],
        keywords: ['360 photo booth', 'video booth', 'event entertainment', 'social media booth'],
    },
     'magic-mirror': {
        slug: 'magic-mirror',
        name: { en: 'Magic Mirror', es: 'Espejo Mágico' },
        longDescription: { en: 'A fully interactive, touch-screen mirror that guides guests with animations and voice guidance to capture the perfect selfie. It includes fun props, digital filters, and instant printing.', es: 'Un espejo táctil totalmente interactivo que guía a los invitados con animaciones y guía de voz para capturar el selfie perfecto. Incluye accesorios divertidos, filtros digitales e impresión instantánea.' },
        images: [
            'https://picsum.photos/seed/service2-1/800/600',
            'https://picsum.photos/seed/service2-2/800/600',
        ],
        keywords: ['magic mirror', 'selfie mirror', 'photo booth', 'interactive entertainment'],
    },
    // Add other services...
};


export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
    const { language } = useLanguage();
    const service = placeholderServicesData[params.slug];

    if (!service) {
        notFound();
    }
    
    const t = {
        requestInquiry: { en: 'Request an Inquiry', es: 'Solicitar Información' },
        keywords: { en: 'Keywords', es: 'Palabras Clave' },
    };

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                     <Carousel className="w-full">
                        <CarouselContent>
                            {service.images.map((img: string, index: number) => (
                            <CarouselItem key={index}>
                                <div className="relative aspect-video">
                                <Image
                                    src={img}
                                    alt={`${service.name[language]} - Image ${index + 1}`}
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
                    <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">{service.name[language]}</h1>
                    <p className="mt-4 text-lg text-foreground/80">{service.longDescription[language]}</p>
                    
                    <div className="mt-8">
                        <h3 className="font-headline text-lg font-semibold flex items-center gap-2"><Tag /> {t.keywords[language]}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {service.keywords.map((keyword: string) => (
                                <span key={keyword} className="bg-secondary text-secondary-foreground text-sm font-medium px-3 py-1 rounded-full">{keyword}</span>
                            ))}
                        </div>
                    </div>

                    <Button asChild size="lg" className="mt-8 bg-accent font-bold text-accent-foreground hover:bg-accent/90">
                        <Link href="/contact">
                            {t.requestInquiry[language]}
                            <Mail className="ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
