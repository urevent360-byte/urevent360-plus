'use client';

import { useLanguage } from '@/contexts/LanguageProvider';

type ExperienceCardContentProps = {
  title: { en: string; es: string };
  description: { en: string; es: string };
};

export function ExperienceCardContent({
  title,
  description,
}: ExperienceCardContentProps) {
  const { language } = useLanguage();
  return (
    <>
      <h3 className="font-headline text-xl font-semibold text-primary">
        {title[language]}
      </h3>
      <p className="mt-2 text-foreground/80">{description[language]}</p>
    </>
  );
}
