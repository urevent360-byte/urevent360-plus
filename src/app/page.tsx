import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import placeholderImages from '@/lib/placeholder-images.json';
import { HeroContent } from '@/components/page/home/HeroContent';
import { ExperiencesContent } from '@/components/page/home/ExperiencesContent';
import type { PlaceholderImage } from '@/lib/types';
import { ExperienceCardContent } from '@/components/page/home/ExperienceCardContent';
import { AboutContent } from '@/components/page/home/AboutContent';
import { InquiryModal } from '@/components/page/home/InquiryModal';
import { ExperiencesCarousel } from '@/components/page/home/ExperiencesCarousel';
import { Testimonials } from '@/components/page/home/Testimonials';
import { ChatWidget } from '@/components/shared/ChatWidget';

const heroImage = placeholderImages.placeholderImages.find(
  p => p.id === 'hero'
);
const aboutImage = placeholderImages.placeholderImages.find(
  p => p.id === 'about-us'
);

export default function Home() {
  return (
    <div className="flex flex-col">
      <InquiryModal />
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

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Testimonials />
        </div>
      </section>
      <ChatWidget />
    </div>
  );
}
