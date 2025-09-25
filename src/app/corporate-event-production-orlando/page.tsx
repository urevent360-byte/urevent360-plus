import { PillarPageLayout } from '@/components/page/pillar/PillarPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Corporate Event Production Orlando | LED Walls, Branding & AV',
  description: 'Professional corporate event production in Orlando. UREVENT 360 PLUS offers LED video walls, custom branding, A/V services, and unique entertainment.',
};

const planningSteps = [
  { title: '1. Define Objectives', description: "We align with your brand's goals, whether it's a product launch, a gala, or an employee appreciation event." },
  { title: '2. Design the Experience', description: "From stage design with LED walls to branded photo booths, we create a cohesive and impactful brand experience." },
  { title: '3. Flawless A/V & Execution', description: "Our technical team handles all audio-visual needs, ensuring your presentations and entertainment run smoothly." },
];

const recommendedServiceIds = ['led-screen-wall', 'custom-monogram', 'magic-mirror'];

const faqItems = [
  { question: "Can you display our company's branding and sponsor logos?", answer: "Yes. Our LED screen walls are perfect for displaying dynamic content, including sponsor loops, company branding, and presentations. We can also project a custom monogram of your logo." },
  { question: "What kind of A/V support do you provide?", answer: "We provide full-service A/V production, including high-quality projectors, screens, sound systems, and on-site technicians to manage everything during your event." },
  { question: "Do you offer entertainment options suitable for a corporate audience?", answer: "Absolutely. Our Magic Mirror photo booth is a sophisticated and engaging option for corporate events. We also offer elegant welcome hostesses and other professional entertainment." },
];

const testimonials = [
  { text: "The LED video wall was a game-changer for our annual conference. The team at UREVENT 360 was professional and their execution was flawless.", author: "John D., Tech Corp", event: "Annual Conference" },
  { text: "We rented the Magic Mirror for our company holiday party and it was a huge success. It was a great icebreaker and a lot of fun.", author: "Samantha K.", event: "Company Holiday Party" },
  { text: "Their attention to detail and ability to incorporate our branding seamlessly made our product launch a memorable event. Highly recommended.", author: "Mark T.", event: "Product Launch" },
];

export default function CorporateEventProductionPage() {
  return (
    <PillarPageLayout
      heroTitle="Orlando Corporate Event Production"
      heroSubtitle="Engage your audience and elevate your brand with our professional production and entertainment services."
      heroImageUrl="https://picsum.photos/seed/orlando-corporate/1920/1080"
      planningSteps={planningSteps}
      recommendedServiceIds={recommendedServiceIds}
      faqItems={faqItems}
      testimonials={testimonials}
    />
  );
}
