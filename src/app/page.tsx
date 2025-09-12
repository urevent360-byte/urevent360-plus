import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';
import { HeroContent } from '@/components/page/home/HeroContent';
import { ExperiencesContent } from '@/components/page/home/ExperiencesContent';
import type { PlaceholderImage } from '@/lib/types';
import { ExperienceCardContent } from '@/components/page/home/ExperienceCardContent';
import { AboutContent } from '@/components/page/home/AboutContent';

const heroImage = placeholderImages.placeholderImages.find(
  p => p.id === 'hero'
);
const aboutImage = placeholderImages.placeholderImages.find(
  p => p.id === 'about-us'
);
const experienceImages = placeholderImages.placeholderImages.filter(p =>
  p.id.startsWith('experience-')
);

const experiences: {
  title: { en: string; es: string };
  description: { en: string; es: string };
  image: PlaceholderImage | undefined;
}[] = [
  {
    title: { en: 'Weddings & Anniversaries', es: 'Bodas y Aniversarios' },
    description: {
      en: 'Crafting magical moments for your special day.',
      es: 'Creando momentos mágicos para tu día especial.',
    },
    image: experienceImages[0],
  },
  {
    title: { en: 'Corporate Events', es: 'Eventos Corporativos' },
    description: {
      en: 'Professional and seamless events that impress.',
      es: 'Eventos profesionales e impecables que impresionan.',
    },
    image: experienceImages[1],
  },
  {
    title: { en: 'Parties & Celebrations', es: 'Fiestas y Celebraciones' },
    description: {
      en: 'Unforgettable parties for any occasion.',
      es: 'Fiestas inolvidables para cualquier ocasión.',
    },
    image: experienceImages[2],
  },
  {
    title: { en: 'Festivals & Concerts', es: 'Festivales y Conciertos' },
    description: {
      en: 'Large-scale events managed with expertise.',
      es: 'Eventos a gran escala gestionados con pericia.',
    },
    image: experienceImages[3],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative flex h-[60vh] w-full items-center justify-center text-center text-white md:h-[80vh]">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            priority
            className="object-cover brightness-50"
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="relative z-10 mx-auto max-w-4xl p-4">
          <HeroContent />
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <ExperiencesContent />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {experiences.map((exp, index) => (
              <Card
                key={index}
                className="group overflow-hidden border-0 shadow-lg transition-shadow duration-500 ease-in-out hover:shadow-2xl"
              >
                <CardContent className="p-0">
                  <div className="relative h-64 w-full">
                    {exp.image && (
                      <Image
                        src={exp.image.imageUrl}
                        alt={exp.image.description}
                        fill
                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                        data-ai-hint={exp.image.imageHint}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    )}
                  </div>
                  <div className="bg-card p-6">
                    <ExperienceCardContent
                      title={exp.title}
                      description={exp.description}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <AboutContent />
            </div>
            <div className="order-1 md:order-2">
              {aboutImage && (
                <Image
                  src={aboutImage.imageUrl}
                  alt={aboutImage.description}
                  width={1200}
                  height={800}
                  className="rounded-lg object-cover shadow-2xl"
                  data-ai-hint={aboutImage.imageHint}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
