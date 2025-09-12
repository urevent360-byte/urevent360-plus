'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageProvider';

export function HeroContent() {
  const { language } = useLanguage();

  return (
    <>
      <h1 className="font-headline text-4xl font-bold tracking-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl">
        {language === 'en'
          ? 'Unforgettable Events, Perfectly Planned.'
          : 'Eventos Inolvidables, Perfectamente Planeados.'}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-white drop-shadow-sm md:text-xl">
        {language === 'en'
          ? "UREVENT 360 PLUS brings your vision to life with passion, creativity, and precision. Let's create memories together."
          : 'UREVENT 360 PLUS hace realidad tu visión con pasión, creatividad y precisión. Creemos recuerdos juntos.'}
      </p>
      <Button
        asChild
        size="lg"
        className="mt-8 bg-accent font-bold text-accent-foreground hover:bg-accent/90"
      >
        <Link href="/contact">
          {language === 'en' ? 'Request an Inquiry' : 'Solicitar Información'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </>
  );
}
