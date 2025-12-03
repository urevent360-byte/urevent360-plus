
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

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
  const { t } = useTranslation();

  const testimonialsData = [
    {
      rating: 5,
      text: t('testimonials.t1.text'),
      author: t('testimonials.t1.author'),
      title: t('testimonials.t1.title'),
    },
    {
      rating: 5,
      text: t('testimonials.t2.text'),
      author: t('testimonials.t2.author'),
      title: t('testimonials.t2.title'),
    },
    {
      rating: 5,
      text: t('testimonials.t3.text'),
      author: t('testimonials.t3.author'),
      title: t('testimonials.t3.title'),
    },
  ];

  return (
    <div className="text-center">
      <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
        {t('testimonials.title')}
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-lg text-foreground/80">
        {t('testimonials.subtitle')}
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
                {testimonial.text}
              </p>
            </div>
            <div className="mt-6">
              <p className="font-semibold text-primary">{testimonial.author}</p>
              <p className="text-sm text-gray-500">{testimonial.title}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
