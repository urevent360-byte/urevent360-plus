'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useOpenInquiryModal } from './InquiryModal';

export function HeroContent() {
  const { setOpen } = useOpenInquiryModal();

  return (
    <>
      <h1 className="font-headline text-4xl font-bold tracking-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl">
        Unforgettable Events, Perfectly Planned.
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-white drop-shadow-sm md:text-xl">
        UREVENT 360 PLUS brings your vision to life with passion, creativity, and precision. Let's create memories together.
      </p>
      <Button
        size="lg"
        className="mt-8 bg-accent font-bold text-accent-foreground hover:bg-accent/90"
        onClick={() => setOpen(true)}
      >
        Request an Inquiry
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </>
  );
}
