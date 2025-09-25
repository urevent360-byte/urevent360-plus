
import { PillarPageLayout } from '@/components/page/pillar/PillarPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quinceañera & Sweet 16 Entertainment Orlando | Hora Loca, 360 Booth',
  description: 'Plan the ultimate Quinceañera or Sweet 16 in Orlando with UREVENT 360 PLUS. We offer Hora Loca with LED Robots, 360 photo booths, and custom monograms.',
};

const planningSteps = [
  { title: '1. Define the Dream', description: "We start by understanding the Quinceañera's unique style and dream for her special day." },
  { title: '2. Select the Fun', description: "Choose from our most popular Quince services, like the 360 booth for social media moments and La Hora Loca to get everyone dancing." },
  { title: '3. Celebrate in Style', description: "Our team ensures everything runs smoothly, so the family can relax and enjoy this once-in-a-lifetime celebration." },
];

const recommendedServiceIds = ['la-hora-loca-led-robot', '360-photo-booth', 'custom-monogram', 'cold-sparklers'];

const faqItems = [
  { question: "What is included in La Hora Loca for a Quinceañera?", answer: "Our standard Hora Loca package includes a high-energy LED Robot, dancers, and fun party props for your guests. We can customize it with stilt walkers, CO2 jets, and more to create an unforgettable party hour!" },
  { question: "Can we have a custom monogram for the Quinceañera?", answer: "Yes! We can design and project a custom monogram with her name, initials, or 'Mis Quince' onto the dance floor or a feature wall. It adds a beautiful, personalized touch to the decor." },
  { question: "Is the 360 Photo Booth a good fit for a Quince or Sweet 16?", answer: "It's our most requested service for these events! Teenagers and their friends love creating dynamic videos for TikTok and Instagram. Our on-site attendant ensures everyone has a great and safe time." },
  { question: "Do you offer services in Spanish?", answer: "¡Claro que sí! Our team is fully bilingual, and we are experts in creating authentic and exciting experiences for Quinceañeras, ensuring all your guests feel included in the fun." }
];

const testimonials = [
  { text: "The LED robot for La Hora Loca was a total surprise and a massive hit! My daughter and her friends were ecstatic.", author: "Mariana V.", event: "Daughter's Quinceañera" },
  { text: "Thank you UREVENT 360 for making my Quince so special. The custom monogram on the dance floor made me feel like a princess.", author: "Sofia G.", event: "My Quinceañera" },
  { text: "Every single guest, young and old, lined up for the 360 photo booth. It was the best decision we made for the party!", author: "David L.", event: "Niece's Quinceañera" },
];

const pageContent = `
## The Ultimate Quinceañera & Sweet 16 Experience

A Quinceañera or Sweet 16 is a once-in-a-lifetime milestone that deserves a spectacular celebration. UREVENT 360 PLUS specializes in turning these important coming-of-age parties into vibrant, high-energy events that the guest of honor and her friends will talk about for years. We understand the importance of tradition while embracing modern trends that resonate with today's teens.

Our most sought-after service, La Hora Loca, brings an unparalleled level of excitement to the dance floor, led by our incredible LED Robot and professional dancers. Combine this with our 360 Photo Booth, and you'll have endless content for social media, capturing all the fun from every angle. For a touch of elegance, a custom projected monogram with her name can transform the ballroom, while cold sparklers can create a dramatic and safe grand entrance. We are a fully bilingual team, ready to create an authentic and unforgettable celebration for your family.
`;

export default function QuinceaneraEntertainmentPage() {
  return (
    <PillarPageLayout
      heroTitle="Quinceañera & Sweet 16 Entertainment in Orlando"
      heroSubtitle="Create a magical and unforgettable celebration with our spectacular entertainment options."
      heroImageUrl="https://picsum.photos/seed/orlando-quince/1920/1080"
      planningSteps={planningSteps}
      recommendedServiceIds={recommendedServiceIds}
      pageContent={pageContent}
      faqItems={faqItems}
      testimonials={testimonials}
    />
  );
}
