import { PillarPageLayout } from '@/components/page/pillar/PillarPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wedding Entertainment Orlando | Photo Booths, Sparklers & More',
  description: 'Create your dream wedding in Orlando with UREVENT 360 PLUS. Discover unique entertainment like 360 photo booths, cold sparklers, and dance on the clouds.',
};

const planningSteps = [
  { title: '1. Share Your Vision', description: "Tell us about your dream wedding. We'll listen to every detail to understand your style and preferences." },
  { title: '2. Curate Your Experience', description: "We'll suggest a package of services like our 360 photo booth, cold sparklers, or dance on the clouds effect to match your vision." },
  { title: '3. Flawless Execution', description: "Our professional team will coordinate with your venue and planner to ensure every moment is perfect on your big day." },
];

const recommendedServiceIds = ['cold-sparklers', 'dance-on-the-clouds', '360-photo-booth'];

const faqItems = [
  { question: "Are the cold sparklers safe for indoor venues?", answer: "Absolutely. Our cold sparkler fountains are designed for indoor use. They are smokeless, odorless, and do not present a fire hazard, making them safe for any venue." },
  { question: "How does the 'Dance on the Clouds' effect work?", answer: "We use professional-grade machines that utilize heated water and dry ice to create a beautiful, thick cloud of low-lying fog that will not rise or trigger smoke alarms." },
  { question: "Can the photo booth prints be customized?", answer: "Yes! We work with you to create a custom design for your photo strips that matches your wedding theme, colors, and includes your names and wedding date." },
];

const testimonials = [
  { text: "The 'Dance on the Clouds' was the most magical moment of our first dance. It looked incredible in the photos!", author: "Emily & Tom", event: "Wedding" },
  { text: "Our guests are still talking about the 360 photo booth. It was so much fun and the videos are amazing.", author: "Sophia P.", event: "Wedding Reception" },
  { text: "The cold sparkler grand exit was the perfect ending to our perfect day. UREVENT 360 was a pleasure to work with.", author: "David & Sarah", event: "Wedding" },
];

export default function WeddingEntertainmentPage() {
  return (
    <PillarPageLayout
      heroTitle="Unforgettable Wedding Entertainment in Orlando"
      heroSubtitle="From magical first dances to high-energy celebrations, we bring your dream wedding to life."
      heroImageUrl="https://picsum.photos/seed/orlando-wedding/1920/1080"
      planningSteps={planningSteps}
      recommendedServiceIds={recommendedServiceIds}
      faqItems={faqItems}
      testimonials={testimonials}
    />
  );
}
