'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const testimonialsData = [
  {
    rating: 5,
    text: '"UREVENT 360 transformed our wedding reception into an unforgettable experience. The 360 Photo Booth was a huge hit!"',
    author: 'Sarah Johnson',
    title: 'Wedding Planner',
  },
  {
    rating: 5,
    text: '"The Magic Mirror brought so much joy to our company party. Everyone was talking about it for weeks!"',
    author: 'Michael Rodriguez',
    title: 'Corporate Event Manager',
  },
  {
    rating: 5,
    text: '"La Hora Loca was exactly what we needed to energize our celebration. Professional and fun!"',
    author: 'Emma Chen',
    title: 'Birthday Party Organizer',
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

  return (
    <div className="text-center">
      <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
        What Our Clients Say
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-lg text-foreground/80">
        Don't just take our word for it - hear from those who've experienced our magic
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
