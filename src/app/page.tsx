
'use server';

import Image from 'next/image';
import { HeroContent } from '@/components/page/home/HeroContent';
import { ExperiencesContent } from '@/components/page/home/ExperiencesContent';
import { AboutContent } from '@/components/page/home/AboutContent';
import { InquiryModal } from '@/components/page/home/InquiryModal';
import { ExperiencesCarousel } from '@/components/page/home/ExperiencesCarousel';
import { Testimonials } from '@/components/page/home/Testimonials';
import { SocialFeed } from '@/components/page/home/SocialFeed';
import { ChatWidget } from '@/components/shared/ChatWidget';
import { CatalogCTA } from '@/components/page/home/CatalogCTA';
import placeholderImages from '@/lib/placeholder-images.json';
import brandingData from '@/lib/branding.json';
import catalogData from '@/lib/catalog.json';

const getBaseUrl = () =>
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:9002';

export default async function Home() {
  const heroPlaceholder = placeholderImages.placeholderImages.find(p => p.id === 'hero');

  const heroImage = {
    imageUrl: brandingData.heroImageUrl || heroPlaceholder?.imageUrl || 'https://picsum.photos/seed/hero/1920/1080',
    description: "A vibrant event with confetti falling on a joyful crowd.",
    imageHint: "event celebration",
  };
  
  const catalogUrl = catalogData.catalogUrl;

  return (
    <div className="flex flex-col">
      <InquiryModal />
      <section className="relative flex h-[60vh] w-full items-center justify-center text-center text-white md:h-[80vh]">
        {heroImage?.imageUrl && (
          <Image
            src={heroImage.imageUrl.startsWith('http') ? heroImage.imageUrl : `${getBaseUrl()}${heroImage.imageUrl}`}
            alt={heroImage.description}
            fill
            priority
            className="object-cover brightness-50"
            data-ai-hint={heroImage.imageHint}
            unoptimized={heroImage.imageUrl.startsWith('/uploads/')}
          />
        )}
        <div className="relative z-10 mx-auto max-w-4xl p-4">
          <HeroContent />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <ExperiencesContent />
          <ExperiencesCarousel />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <AboutContent />
        </div>
      </section>

      {catalogUrl && (
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <CatalogCTA catalogUrl={catalogUrl} />
          </div>
        </section>
      )}

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Testimonials />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SocialFeed />
        </div>
      </section>

      <ChatWidget />
    </div>
  );
}
