
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

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

function resolveAssetUrl(url?: string | null): { src: string; unoptimized: boolean } {
  const base = getBaseUrl();
  if (!url) return { src: `${base}/og-image.png`, unoptimized: false };
  // Remote absolute URL
  if (/^https?:\/\//i.test(url)) return { src: url, unoptimized: false };
  // Relative path (e.g., /uploads/hero.jpg)
  const path = url.startsWith('/') ? url : `/${url}`;
  const isLocalUpload = path.startsWith('/uploads/');
  return { src: `${base}${path}`, unoptimized: isLocalUpload };
}

export default async function Home() {
  const heroPlaceholder =
    (placeholderImages as any)?.placeholderImages?.find?.((p: any) => p?.id === 'hero') ?? null;

  const imageUrl =
    (brandingData as any)?.heroImageUrl ??
    heroPlaceholder?.imageUrl ??
    'https://picsum.photos/seed/hero/1920/1080';

  const { src: heroSrc, unoptimized } = resolveAssetUrl(imageUrl);

  const catalogUrl: string | undefined = (catalogData as any)?.catalogUrl;

  return (
    <div className="flex flex-col">
      <InquiryModal />

      <section className="relative flex h-[60vh] w-full items-center justify-center text-center text-white md:h-[80vh]">
        <Image
          src={heroSrc}
          alt="A vibrant event with confetti falling on a joyful crowd."
          fill
          priority
          className="object-cover brightness-50"
          data-ai-hint="event celebration"
          unoptimized={unoptimized}
        />
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
