'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useOpenInquiryModal } from './InquiryModal';
import { useTranslation } from '@/hooks/useTranslation';

export function HeroContent() {
  const { setOpen } = useOpenInquiryModal();
  const { t } = useTranslation();

  return (
    <>
      <h1 className="font-headline text-4xl font-bold tracking-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl">
        {t('hero.title')}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-white drop-shadow-sm md:text-xl">
        {t('hero.subtitle')}
      </p>
      <Button
        size="lg"
        className="mt-8 bg-accent font-bold text-accent-foreground hover:bg-accent/90"
        onClick={() => setOpen(true)}
      >
        {t('hero.requestInquiry')}
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </>
  );
}
