import type { Language } from '@/contexts/LanguageProvider';

type Messages = Record<string, string>;

const en: Messages = {
  'hero.requestInquiry': 'Request an Inquiry',
  'hero.subtitle': 'From intimate gatherings to grand celebrations, we specialize in creating bespoke events that reflect your unique style.',
  'section.ourExperiences': 'Our Experiences',
};

const es: Messages = {
  'hero.requestInquiry': 'Solicitar Cotización',
  'hero.subtitle': 'Desde reuniones íntimas hasta grandes celebraciones, creamos eventos a la medida que reflejan tu estilo único.',
  'section.ourExperiences': 'Nuestras Experiencias',
};

const dictionaries: Record<Language, Messages> = {
  en,
  es,
};

export function getTranslation(lang: Language, key: string): string {
  const dict = dictionaries[lang] || dictionaries.en;
  return dict[key] ?? key;
}
