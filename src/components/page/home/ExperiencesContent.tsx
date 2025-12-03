'use client';

import { useTranslation } from '@/hooks/useTranslation';

export function ExperiencesContent() {
  const { t } = useTranslation();

  return (
    <div className="mb-12 text-center">
      <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
        {t('section.ourExperiences')}
      </h2>
      <p className="mx-auto mt-2 max-w-3xl text-lg text-foreground/80">
        {t('experiences.subtitle')}
      </p>
    </div>
  );
}
