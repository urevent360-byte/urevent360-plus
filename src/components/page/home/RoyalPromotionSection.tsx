
'use client';

import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useOpenRoyalInquiryModal } from '@/hooks/use-royal-inquiry-modal';

export function RoyalPromotionSection() {
  const { setOpen } = useOpenRoyalInquiryModal();

  return (
    <section className="bg-secondary py-12 md:py-16">
      <div className="container mx-auto px-4 text-center">
        <Sparkles className="mx-auto h-12 w-12 text-accent" />
        <h2 className="mt-4 font-headline text-3xl font-bold text-primary md:text-4xl">
          Introducing Royal Celebration Jr.
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-lg text-foreground/80">
          A magical, all-inclusive party experience designed for our little VIPs. Let us handle the details for a celebration they'll never forget!
        </p>
        <Button onClick={() => setOpen(true)} size="lg" className="mt-6 bg-accent font-bold text-accent-foreground hover:bg-accent/90">
          Learn More & Inquire
        </Button>
      </div>
    </section>
  );
}
