'use client';

import { useLanguage } from '@/contexts/LanguageProvider';

export function ExperiencesContent() {
  const { language } = useLanguage();

  return (
    <div className="mb-12 text-center">
      <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
        {language === 'en' ? 'Our Experiences' : 'Nuestras Experiencias'}
      </h2>
      <p className="mx-auto mt-2 max-w-3xl text-lg text-foreground/80">
        {language === 'en'
          ? 'From intimate gatherings to grand celebrations, we specialize in creating bespoke events that reflect your unique style.'
          : 'Desde reuniones íntimas hasta grandes celebraciones, nos especializamos en crear eventos a medida que reflejan tu estilo único.'}
      </p>
    </div>
  );
}
