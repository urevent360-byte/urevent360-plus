
'use server';

import { HeroSection } from '@/components/page/home/HeroSection';
import { ExperiencesContent } from '@/components/page/home/ExperiencesContent';
import { AboutContent } from '@/components/page/home/AboutContent';
import { ExperiencesCarousel } from '@/components/page/home/ExperiencesCarousel';
import { Testimonials } from '@/components/page/home/Testimonials';
import { SocialFeed } from '@/components/page/home/SocialFeed';
import { ChatWidget } from '@/components/shared/ChatWidget';
import { CatalogCTA } from '@/components/page/home/CatalogCTA';
import catalogData from '@/lib/catalog.json';


export default async function Home() {
  const catalogUrl: string | undefined = (catalogData as any)?.catalogUrl;

  return (
    <div className="flex flex-col">
      <HeroSection />

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
