
import { PillarPageLayout } from '@/components/page/pillar/PillarPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wedding Entertainment in Orlando | UREVENT 360 PLUS',
  description: 'Premium Orlando wedding entertainment—360 photo booth, LED tunnel, cold sparklers, dance on the clouds, monograms & more. Plan a custom package today.',
  alternates: {
    canonical: '/wedding-entertainment-orlando',
    languages: {
      'en': '/wedding-entertainment-orlando',
      'es': '/es/entretenimiento-bodas-orlando',
    },
  },
};

const planningSteps = [
  { title: '1. Share Your Vision (9-12 Months Out)', description: "Tell us about your dream wedding. We'll listen to every detail to understand your style and help you select entertainment that tells your unique love story." },
  { title: '2. Curate Your Experience (6-9 Months Out)', description: "Lock in your date and choose from our premium services. We'll draft a proposal that aligns with your budget and venue, coordinating all technical details." },
  { title: '3. Flawless Execution (Final Month)', description: "Our professional team confirms the final timeline with your planner and venue. On your big day, we handle everything, letting you relax and enjoy every magical moment." },
];

const recommendedServiceIds = ['360-photo-booth', 'led-tunnel-neon-tubes', 'cold-sparklers', 'dance-on-the-clouds'];

const faqItems = [
  { question: "Are the cold sparklers safe for indoor venues in Orlando?", answer: "Absolutely. Our cold sparkler fountains are designed for indoor use and are approved by most Orlando and Central Florida venues. They are smokeless, odorless, and do not present a fire hazard, making them safe for any space." },
  { question: "How does the 'Dance on the Clouds' effect work?", answer: "We use professional-grade machines that utilize heated water and dry ice to create a beautiful, thick cloud of low-lying fog that will not rise or trigger smoke alarms, perfect for a romantic first dance." },
  { question: "Can the photo booth prints and video overlays be customized for our wedding?", answer: "Yes! We work with you to create a custom design for your photo strips or 360 video overlays that matches your wedding theme, colors, and includes your names and wedding date." },
  { question: "How much space do you need for the 360 Photo Booth?", answer: "We generally recommend a clear, flat area of at least 10x10 feet. This ensures the camera arm can rotate safely and guests have enough room to dance and pose. We always coordinate with your venue to find the perfect spot." },
  { question: "Do your packages include an on-site attendant?", answer: "Yes, all of our interactive entertainment services, like the 360 Photo Booth and Magic Mirror, come with a professional and friendly on-site attendant to ensure everything runs smoothly and your guests have a wonderful experience." }
];

const testimonials = [
  { text: "The 'Dance on the Clouds' was the most magical moment of our first dance. It looked incredible in the photos!", author: "Emily & Tom", event: "Wedding at The Benvenuto" },
  { text: "Our guests are still talking about the 360 photo booth. It was so much fun and the videos are amazing.", author: "Sophia P.", event: "Wedding Reception in Orlando" },
  { text: "The cold sparkler grand exit was the perfect ending to our perfect day. UREVENT 360 was a pleasure to work with.", author: "David & Sarah", event: "Wedding at The Acre" },
];

const pageContent = `
## Creating Unforgettable Orlando Wedding Experiences

Your wedding day is a celebration of your unique love story, and the entertainment you choose is the brushstroke that turns a beautiful day into a masterpiece of memories. At UREVENT 360 PLUS, we specialize in transforming Orlando weddings with premium, immersive entertainment that captivates guests and creates picture-perfect moments. Forget outdated wedding trends; modern couples are choosing interactive and visually stunning experiences that reflect their personality. From a jaw-dropping grand entrance through a custom LED Tunnel to a magical first dance on a cloud, our services are designed to integrate seamlessly with your vision and venue.

We believe that wedding entertainment should be more than just a background playlist; it should be an integral part of your celebration. That's why our most sought-after services, like the **360 Photo Booth**, provide not just fun, but also a take-home memory for your guests. Imagine the romance of a first dance amplified by our **Dance on the Clouds** effect, or the sheer excitement of an exit surrounded by safe, indoor **Cold Sparklers**. Our bilingual (EN/ES) team coordinates every detail with your venue and planner, from power requirements to timeline cues, ensuring a stress-free experience. Let's work together to make your Orlando wedding the one everyone talks about for years to come.
`;

export default function WeddingEntertainmentPage() {
  return (
    <PillarPageLayout
      heroTitle="Wedding Entertainment in Orlando: 360 Booth, LED Tunnel & More"
      heroSubtitle="Premium Orlando wedding entertainment—360 photo booth, LED tunnel, cold sparklers, dance on the clouds, monograms & more. Plan a custom package today."
      heroImageUrl="https://picsum.photos/seed/orlando-wedding/1920/1080"
      planningSteps={planningSteps}
      recommendedServiceIds={recommendedServiceIds}
      pageContent={pageContent}
      faqItems={faqItems}
      testimonials={testimonials}
    />
  );
}
