'use client';
import { useLanguage } from '@/contexts/LanguageProvider';
import { translations } from '@/lib/translations';

export function AboutContent() {
  const { language } = useLanguage();
  return (
    <>
      <span className="font-headline text-lg font-semibold text-accent">
        {translations.about.subtitle[language]}
      </span>
      <h2 className="mt-2 font-headline text-3xl font-bold text-primary md:text-4xl">
        {translations.about.title[language]}
      </h2>
      <p className="mt-4 text-lg text-foreground/80">
        {translations.about.description1[language]}
      </p>
      <p className="mt-4 text-lg text-foreground/80">
        {translations.about.description2[language]}
      </p>
    </>
  );
}
