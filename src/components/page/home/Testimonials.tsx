'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageProvider';
import { translations } from '@/lib/translations';
import { Star, Quote } from 'lucide-react';

const testimonialsData = [
  {
    rating: 5,
    text: {
      en: '"UREVENT 360 transformed our wedding reception into an unforgettable experience. The 360 Photo Booth was a huge hit!"',
      es: '"UREVENT 360 transformó la recepción de nuestra boda en una experiencia inolvidable. ¡La cabina de fotos 360 fue un gran éxito!"',
    },
    author: 'Sarah Johnson',
    title: { en: 'Wedding Planner', es: 'Organizadora de Bodas' },
  },
  {
    rating: 5,
    text: {
      en: '"The Magic Mirror brought so much joy to our company party. Everyone was talking about it for weeks!"',
      es: '"El Espejo Mágico trajo mucha alegría a nuestra fiesta de empresa. ¡Todos hablaron de ello durante semanas!"',
    },
    author: 'Michael Rodriguez',
    title: { en: 'Corporate Event Manager', es: 'Gerente de Eventos Corporativos' },
  },
  {
    rating: 5,
    text: {
      en: '"La Hora Loca was exactly what we needed to energize our celebration. Professional and fun!"',
      es: '"La Hora Loca fue exactamente lo que necesitábamos para energizar nuestra celebración. ¡Profesional y divertido!"',
    },
    author: 'Emma Chen',
    title: { en: 'Birthday Party Organizer', es: 'Organizadora de Cumpleaños' },
  },
];

const Rating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'
        }`}
      />
    ))}
  </div>
);

export function Testimonials() {
  const { language } = useLanguage();
  const content = translations.testimonials;

  return (
    <div className="text-center">
      <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
        {content.title[language]}
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-lg text-foreground/80">
        {content.subtitle[language]}
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testimonialsData.map((testimonial, index) => (
          <Card key={index} className="flex flex-col justify-between text-left shadow-lg border-0 bg-white p-6">
            <div>
              <div className="flex items-center justify-between">
                <Rating rating={testimonial.rating} />
                <Quote className="h-10 w-10 text-primary/20" />
              </div>
              <p className="mt-4 text-gray-700 italic">
                {testimonial.text[language]}
              </p>
            </div>
            <div className="mt-6">
              <p className="font-semibold text-primary">{testimonial.author}</p>
              <p className="text-sm text-gray-500">{testimonial.title[language]}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
