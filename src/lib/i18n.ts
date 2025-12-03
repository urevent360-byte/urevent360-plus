import type { Language } from '@/contexts/LanguageProvider';

type Messages = Record<string, string>;

const en: Messages = {
  'hero.title': 'Unforgettable Events, Perfectly Planned.',
  'hero.subtitle': "UREVENT 360 PLUS brings your vision to life with passion, creativity, and precision. Let's create memories together.",
  'hero.requestInquiry': 'Request an Inquiry',
  'section.ourExperiences': 'Our Experiences',
  'experiences.subtitle': 'From intimate gatherings to grand celebrations, we specialize in creating bespoke events that reflect your unique style.',
};

const es: Messages = {
  'hero.title': 'Eventos Inolvidables, Perfectamente Planeados.',
  'hero.subtitle': 'UREVENT 360 PLUS hace realidad tu visión con pasión, creatividad y precisión. Creemos recuerdos juntos.',
  'hero.requestInquiry': 'Solicitar Cotización',
  'section.ourExperiences': 'Nuestras Experiencias',
  'experiences.subtitle': 'Desde reuniones íntimas hasta grandes celebraciones, nos especializamos en crear eventos a medida que reflejan tu estilo único.',
};

const dictionaries: Record<Language, Messages> = {
  en,
  es,
};

export function getTranslation(lang: Language, key: string): string {
  const dict = dictionaries[lang] || dictionaries.en;
  return dict[key] ?? key;
}
