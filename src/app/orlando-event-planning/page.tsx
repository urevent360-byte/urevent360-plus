
import { PillarPageLayout } from '@/components/page/pillar/PillarPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Planning & Entertainment in Orlando | UREVENT 360 PLUS',
  description: 'Guía para planear bodas, quince, cumpleaños y eventos corporativos; incluye checklist, tiempos, y opciones como 360 booth, La Hora Loca, túnel LED y más.',
};

const planningSteps = [
  { title: '1. Consultation & Vision', description: "We start with a free consultation to understand your vision, theme, and goals for the event." },
  { title: '2. Custom Proposal', description: "Based on our discussion, we create a detailed proposal with recommended services and transparent pricing." },
  { title: '3. Plan & Finalize', description: "Once approved, we coordinate all logistics, timelines, and details, keeping you informed every step of the way." },
];

const recommendedServiceIds = ['360-photo-booth', 'la-hora-loca-led-robot', 'led-tunnel-neon-tubes'];

const faqItems = [
  { question: "What types of events do you specialize in?", answer: "We specialize in a wide range of events including weddings, quinceañeras, corporate functions, birthday parties, and brand activations. Our team is equipped to handle events of any scale." },
  { question: "How far in advance should I book your services?", answer: "We recommend booking as early as possible, especially for popular dates. A good rule of thumb is 6-12 months for weddings and 3-6 months for other large events." },
  { question: "Do you serve areas outside of Orlando?", answer: "Yes! While we are based in Orlando, we proudly serve all of Central Florida. Contact us to discuss your event location." },
];

const testimonials = [
  { text: "UREVENT 360 PLUS took our corporate gala to the next level. The planning was flawless and the LED wall was spectacular.", author: "Maria S.", event: "Corporate Gala" },
  { text: "They made my daughter's quinceañera a dream come true. The Hora Loca was the highlight of the night!", author: "Carlos R.", event: "Quinceañera" },
  { text: "The most professional and creative event team I've ever worked with. Our wedding was perfect.", author: "Jessica L.", event: "Wedding" },
];

const pageContent = `
## Your Partner in Creating Unforgettable Orlando Events

Planning an event, whether it's a dream wedding, a milestone quinceañera, or a high-impact corporate function, requires a clear vision and flawless execution. At UREVENT 360 PLUS, we are more than just an entertainment provider; we are your creative partners. Our team is dedicated to bringing your vision to life with a combination of spectacular services and meticulous planning.

We specialize in creating immersive experiences that engage your guests from the moment they arrive. From dazzling LED video walls and futuristic entrance tunnels to high-energy Hora Loca performances and interactive photo booths, we offer a comprehensive suite of services to elevate any occasion. Our bilingual team understands the unique needs of Orlando's diverse community and is committed to delivering a seamless, stress-free planning process. Let's work together to make your next event not just successful, but truly legendary.
`;

export default function OrlandoEventPlanningPage() {
  return (
    <PillarPageLayout
      heroTitle="Orlando Event Planning & Entertainment"
      heroSubtitle="Your complete guide to planning unforgettable weddings, quinceañeras, and corporate events in Central Florida."
      heroImageUrl="https://picsum.photos/seed/orlando-planning/1920/1080"
      planningSteps={planningSteps}
      recommendedServiceIds={recommendedServiceIds}
      pageContent={pageContent}
      faqItems={faqItems}
      testimonials={testimonials}
    />
  );
}
