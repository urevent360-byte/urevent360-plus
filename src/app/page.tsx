
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';
import { HeroContent } from '@/components/page/home/HeroContent';
import { ExperiencesContent } from '@/components/page/home/ExperiencesContent';
import { AboutContent } from '@/components/page/home/AboutContent';
import { InquiryModal } from '@/components/page/home/InquiryModal';
import { ExperiencesCarousel } from '@/components/page/home/ExperiencesCarousel';
import { Testimonials } from '@/components/page/home/Testimonials';
import { SocialFeed } from '@/components/page/home/SocialFeed';
import { ChatWidget } from '@/components/shared/ChatWidget';
import fs from 'fs/promises';
import path from 'path';
import { CatalogCTA } from '@/components/page/home/CatalogCTA';

const getBaseUrl = () =>
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:9002';

async function getBranding() {
  const brandingPath = path.join(process.cwd(), 'public', 'branding.json');
  try {
    const data = await fs.readFile(brandingPath, 'utf-8');
    const branding = JSON.parse(data);
    if (branding && branding.heroImageUrl) return branding;
  } catch {
    // Fallback if file doesn't exist or is invalid
  }
  const heroPlaceholder = placeholderImages?.placeholderImages?.find(p => p.id === 'hero');
  return {
    logoUrl: null,
    heroImageUrl: heroPlaceholder?.imageUrl || 'https://picsum.photos/seed/hero/1920/1080',
  };
}

async function getCatalogUrl() {
  const catalogPath = path.join(process.cwd(), 'public', 'catalog.json');
  try {
    const data = await fs.readFile(catalogPath, 'utf-8');
    const config = JSON.parse(data);
    return config.catalogUrl;
  } catch {
    // Return null if file doesn't exist or is invalid
    return null;
  }
}

export default async function Home() {
  const branding = await getBranding();
  const catalogUrl = await getCatalogUrl();
  const heroImage = {
    imageUrl: branding.heroImageUrl,
    description: "A vibrant event with confetti falling on a joyful crowd.",
    imageHint: "event celebration",
  };

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
