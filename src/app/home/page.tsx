
'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useOnScreen } from '@/hooks/use-on-screen';
import { HeroContent } from '@/components/page/home/HeroContent';
import { ExperiencesContent } from '@/components/page/home/ExperiencesContent';
import { ExperiencesCarousel } from '@/components/page/home/ExperiencesCarousel';
import { AboutContent } from '@/components/page/home/AboutContent';
import { Testimonials } from '@/components/page/home/Testimonials';
import { SocialFeed } from '@/components/page/home/SocialFeed';
import { CatalogCTA } from '@/components/page/home/CatalogCTA';
import placeholderImages from '@/lib/placeholder-images.json';
import { ChatWidget } from '@/components/shared/ChatWidget';

// Mock catalog URL for the CTA
const mockCatalogUrl = "/urevent-360-plus-catalog.pdf";

export default function Home() {
  const heroData = placeholderImages.placeholderImages.find(p => p.id === 'hero');

  const experiencesRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  const isExperiencesVisible = useOnScreen(experiencesRef, '-100px');
  const isAboutVisible = useOnScreen(aboutRef, '-100px');
  const isTestimonialsVisible = useOnScreen(testimonialsRef, '-100px');
  const isSocialVisible = useOnScreen(socialRef, '-100px');
  const isCatalogVisible = useOnScreen(catalogRef, '-100px');

  return (
    <div className="flex flex-col">
      <section className="relative flex h-screen w-full items-center justify-center bg-gray-800 text-center text-white">
        {heroData && (
          <Image
            src={heroData.imageUrl}
            alt={heroData.description}
            fill
            priority
            className="object-cover brightness-50"
          />
        )}
        <div className="relative z-10 mx-auto max-w-4xl p-4">
          <HeroContent />
        </div>
      </section>

      <section
        ref={experiencesRef}
        className={`py-16 md:py-24 transition-opacity duration-700 ease-in ${isExperiencesVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="container mx-auto px-4">
          <ExperiencesContent />
          <div className="mt-12">
            <ExperiencesCarousel />
          </div>
        </div>
      </section>

      <section
        ref={aboutRef}
        className={`py-16 md:py-24 bg-muted/50 transition-opacity duration-700 ease-in ${isAboutVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="container mx-auto px-4">
          <AboutContent />
        </div>
      </section>

      <section
        ref={testimonialsRef}
        className={`py-16 md:py-24 transition-opacity duration-700 ease-in ${isTestimonialsVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="container mx-auto px-4">
          <Testimonials />
        </div>
      </section>

      <section
        ref={catalogRef}
        className={`py-16 md:py-24 bg-muted/50 transition-opacity duration-700 ease-in ${isCatalogVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="container mx-auto px-4">
          <CatalogCTA catalogUrl={mockCatalogUrl} />
        </div>
      </section>

      <section
        ref={socialRef}
        className={`py-16 md:py-24 transition-opacity duration-700 ease-in ${isSocialVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="container mx-auto px-4">
          <SocialFeed />
        </div>
      </section>
      <ChatWidget />
    </div>
  );
}
