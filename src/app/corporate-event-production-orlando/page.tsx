
import { PillarPageLayout } from '@/components/page/pillar/PillarPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Corporate Event Entertainment in Orlando | LED Walls & Tunnels',
  description: 'High-impact corporate experiences: LED video walls, LED tunnel entrances, interactive photo booths & show control. Brand-ready in Orlando.',
  alternates: {
    canonical: '/corporate-event-production-orlando',
    languages: {
      'en': '/corporate-event-production-orlando',
      'es': '/es/entretenimiento-corporativo-orlando',
    },
  },
};

const planningSteps = [
  { title: '1. Define Objectives', description: "We align with your brand's goals, whether it's a product launch, conference, holiday party, or an employee appreciation event." },
  { title: '2. Design the Experience', description: "From stage design with LED walls to branded photo booths, we create a cohesive and impactful brand experience." },
  { title: '3. Flawless A/V & Execution', description: "Our technical team handles all audio-visual needs, ensuring your presentations and entertainment run smoothly." },
];

const recommendedServiceIds = ['led-screen-wall', 'led-tunnel-neon-tubes', 'custom-monogram', 'magic-mirror'];

const faqItems = [
  { question: "Can you display our company's branding and sponsor logos?", answer: "Yes. Our LED screen walls are perfect for displaying dynamic content, including sponsor loops, company branding, and presentations. We can also project a custom monogram of your logo or use branded overlays on our photo booths." },
  { question: "What kind of A/V support do you provide?", answer: "We provide full-service A/V production, including high-quality projectors, screens, sound systems, and on-site technicians to manage everything during your event, ensuring a professional and seamless presentation." },
  { question: "Do you offer entertainment options suitable for a corporate audience?", answer: "Absolutely. Our Magic Mirror and 360 Photo Booth are sophisticated and engaging options for corporate events, providing excellent networking and social sharing opportunities. We also offer elegant welcome hostesses." },
  { question: "How can your services enhance our brand activation?", answer: "Our services are designed for brand integration. We can customize the LED wall content, photo booth interfaces, print designs, and even the welcome experience to reflect your brand identity, creating immersive and shareable moments." },
];

const testimonials = [
  { text: "The LED video wall was a game-changer for our annual conference. The team at UREVENT 360 was professional and their execution was flawless.", author: "John D., Tech Corp", event: "Annual Conference" },
  { text: "We rented the Magic Mirror for our company holiday party and it was a huge success. It was a great icebreaker and a lot of fun.", author: "Samantha K.", event: "Company Holiday Party" },
  { text: "Their attention to detail and ability to incorporate our branding seamlessly made our product launch a memorable event. Highly recommended.", author: "Mark T.", event: "Product Launch" },
];

const pageContent = `
## Corporate Event Entertainment & Visuals in Orlando

Drive engagement with LED video walls, branded entrances, interactive photo booths, and show control. We scale to your venue and run a crisp, on-schedule production your partners will love. In the corporate world, events are an opportunity to make a powerful statement. Whether you're launching a product, hosting a conference, or celebrating your team's success, the production quality reflects directly on your brand. UREVENT 360 PLUS is your partner in creating polished, engaging, and memorable corporate events in Orlando. We understand the need for professionalism and flawless execution.

Our state-of-the-art LED Video Walls can transform any venue, serving as a dynamic backdrop for presentations, branding, and sponsor recognition. For interactive engagement, our sleek Magic Mirror and 360 Photo Booths can be fully branded, providing guests with fun, shareable content that amplifies your message online. We handle all technical aspects, from audio-visual setup to on-site management, allowing you to focus on your guests and your goals. Let us help you create an event that not only impresses but also achieves your business objectives.
`;

export default function CorporateEventProductionPage() {
  return (
    <PillarPageLayout
      heroTitle="Corporate Event Entertainment & Visuals in Orlando"
      heroSubtitle="High-impact corporate experiences: LED video walls, LED tunnel entrances, interactive photo booths & show control. Brand-ready in Orlando."
      heroImageUrl="https://picsum.photos/seed/orlando-corporate/1920/1080"
      planningSteps={planningSteps}
      recommendedServiceIds={recommendedServiceIds}
      pageContent={pageContent}
      faqItems={faqItems}
      testimonials={testimonials}
    />
  );
}

