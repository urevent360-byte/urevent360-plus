
'use client';

import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useOpenRoyalInquiryModal } from '@/hooks/use-royal-inquiry-modal';
import { useTranslation } from '@/hooks/useTranslation';

export function RoyalPromotionSection() {
  const { setOpen } = useOpenRoyalInquiryModal();
  const { t } = useTranslation();

  return (
    <section className="bg-secondary py-12 md:py-16">
      <div className="container mx-auto px-4 text-center">
        <Sparkles className="mx-auto h-12 w-12 text-accent" />
        <h2 className="mt-4 font-headline text-3xl font-bold text-primary md:text-4xl">
          {t('royal.title')}
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-lg text-foreground/80">
          {t('royal.subtitle')}
        </p>
        <Button onClick={() => setOpen(true)} size="lg" className="mt-6 bg-accent font-bold text-accent-foreground hover:bg-accent/90">
          {t('royal.button')}
        </Button>
      </div>
    </section>
  );
}
