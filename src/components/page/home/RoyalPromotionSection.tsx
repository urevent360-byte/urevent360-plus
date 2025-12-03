
'use client';

import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export function RoyalPromotionSection() {
  const handleOpenModal = () => {
    // This will trigger the modal in a later step
    console.log('Opening Royal Celebration Jr. inquiry modal...');
    // We will replace this with the modal logic in the next step.
  };

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
        <Button onClick={handleOpenModal} size="lg" className="mt-6 bg-accent font-bold text-accent-foreground hover:bg-accent/90">
          Learn More & Inquire
        </Button>
      </div>
    </section>
  );
}
