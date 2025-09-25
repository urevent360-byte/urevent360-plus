
import { PillarPageLayout } from '@/components/page/pillar/PillarPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wedding Entertainment Orlando | Photo Booths, Sparklers & More',
  description: 'Create your dream wedding in Orlando with UREVENT 360 PLUS. Discover unique entertainment like 360 photo booths, cold sparklers, and dance on the clouds effect for a magical celebration.',
};

const planningSteps = [
  { title: '1. Share Your Vision', description: "Tell us about your dream wedding. We'll listen to every detail to understand your style and preferences." },
  { title: '2. Curate Your Experience', description: "We'll suggest a package of services like our 360 photo booth, cold sparklers, or dance on the clouds effect to match your vision." },
  { title: '3. Flawless Execution', description: "Our professional team will coordinate with your venue and planner to ensure every moment is perfect on your big day." },
];

const recommendedServiceIds = ['cold-sparklers', 'dance-on-the-clouds', '360-photo-booth', 'custom-monogram'];

const faqItems = [
  { question: "Are the cold sparklers safe for indoor venues in Orlando?", answer: "Absolutely. Our cold sparkler fountains are designed for indoor use and are approved by most Orlando and Central Florida venues. They are smokeless, odorless, and do not present a fire hazard, making them safe for any space." },
  { question: "How does the 'Dance on the Clouds' effect work?", answer: "We use professional-grade machines that utilize heated water and dry ice to create a beautiful, thick cloud of low-lying fog that will not rise or trigger smoke alarms, perfect for a romantic first dance." },
  { question: "Can the photo booth prints be customized for our wedding?", answer: "Yes! We work with you to create a custom design for your photo strips that matches your wedding theme, colors, and includes your names and wedding date." },
  { question: "What is the most popular entertainment for a wedding reception?", answer: "The 360 Photo Booth is a massive hit at weddings for creating fun, shareable videos. For a 'wow' moment, the Cold Sparklers for the grand entrance or exit and the Dance on the Clouds for the first dance are incredibly popular." }
];

const testimonials = [
  { text: "The 'Dance on the Clouds' was the most magical moment of our first dance. It looked incredible in the photos!", author: "Emily & Tom", event: "Wedding at The Benvenuto" },
  { text: "Our guests are still talking about the 360 photo booth. It was so much fun and the videos are amazing.", author: "Sophia P.", event: "Wedding Reception in Orlando" },
  { text: "The cold sparkler grand exit was the perfect ending to our perfect day. UREVENT 360 was a pleasure to work with.", author: "David & Sarah", event: "Wedding at The Acre" },
];

const pageContent = `
## Make Your Orlando Wedding Unforgettable

Your wedding day is one of the most important moments of your life, and the entertainment you choose plays a crucial role in making it memorable. At UREVENT 360 PLUS, we specialize in providing premium, modern entertainment that elevates your celebration from ordinary to extraordinary. Whether you're hosting an elegant reception at a classic Orlando venue or a chic party in a modern space, our services are designed to integrate seamlessly and create 'wow' moments for you and your guests.

From a magical first dance on a cloud of low-lying fog to a grand exit through a tunnel of safe, indoor cold sparklers, we focus on creating picture-perfect memories. Our interactive photo booths, like the wildly popular 360 Photo Booth, give your guests a fun activity and a personalized keepsake to remember your special day. We work closely with you and your wedding planner to ensure every detail is flawless, allowing you to relax and soak in every moment of your celebration.
`;

export default function WeddingEntertainmentPage() {
  return (
    <PillarPageLayout
      heroTitle="Unforgettable Wedding Entertainment in Orlando"
      heroSubtitle="From magical first dances to high-energy celebrations, we bring your dream wedding to life."
      heroImageUrl="https://picsum.photos/seed/orlando-wedding/1920/1080"
      planningSteps={planningSteps}
      recommendedServiceIds={recommendedServiceIds}
      pageContent={pageContent}
      faqItems={faqItems}
      testimonials={testimonials}
    />
  );
}
