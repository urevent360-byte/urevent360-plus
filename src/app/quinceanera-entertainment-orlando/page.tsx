import { PillarPageLayout } from '@/components/page/pillar/PillarPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quinceañera Entertainment Orlando | Hora Loca, 360 Booth & More',
  description: 'Plan the ultimate Quinceañera in Orlando with UREVENT 360 PLUS. We offer Hora Loca with LED Robots, 360 photo booths, and custom monograms.',
};

const planningSteps = [
  { title: '1. Define the Dream', description: "We start by understanding the Quinceañera's unique style and dream for her special day." },
  { title: '2. Select the Fun', description: "Choose from our most popular Quince services, like the 360 booth for social media moments and La Hora Loca to get everyone dancing." },
  { title: '3. Celebrate in Style', description: "Our team ensures everything runs smoothly, so the family can relax and enjoy this once-in-a-lifetime celebration." },
];

const recommendedServiceIds = ['la-hora-loca-led-robot', '360-photo-booth', 'custom-monogram'];

const faqItems = [
  { question: "What is included in La Hora Loca?", answer: "Our standard Hora Loca package includes a high-energy LED Robot, dancers, and fun party props for your guests. We can customize it with stilt walkers, CO2 jets, and more!" },
  { question: "Can we have a custom monogram for the Quinceañera?", answer: "Yes! We can design and project a custom monogram with her name, initials, or 'Mis Quince' onto the dance floor or a feature wall. It adds a beautiful, personalized touch." },
  { question: "Is the 360 Photo Booth suitable for all ages?", answer: "Definitely! Guests of all ages, from kids to grandparents, love the 360 photo booth. Our on-site attendant ensures everyone has a great and safe time." },
];

const testimonials = [
  { text: "The LED robot for La Hora Loca was a total surprise and a massive hit! My daughter and her friends were ecstatic.", author: "Mariana V.", event: "Daughter's Quinceañera" },
  { text: "Thank you UREVENT 360 for making my Quince so special. The custom monogram on the dance floor made me feel like a princess.", author: "Sofia G.", event: "My Quinceañera" },
  { text: "Every single guest, young and old, lined up for the 360 photo booth. It was the best decision we made for the party!", author: "David L.", event: "Niece's Quinceañera" },
];

export default function QuinceaneraEntertainmentPage() {
  return (
    <PillarPageLayout
      heroTitle="The Ultimate Quinceañera Entertainment in Orlando"
      heroSubtitle="Create a magical and unforgettable celebration with our spectacular entertainment options."
      heroImageUrl="https://picsum.photos/seed/orlando-quince/1920/1080"
      planningSteps={planningSteps}
      recommendedServiceIds={recommendedServiceIds}
      faqItems={faqItems}
      testimonials={testimonials}
    />
  );
}
