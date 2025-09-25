
import { PillarPageLayout } from '@/components/page/pillar/PillarPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prom Entertainment Orlando | 360 Photo Booth, LED Tunnel & More',
  description: 'Make your Orlando prom or homecoming unforgettable with UREVENT 360 PLUS. Featuring 360 Photo Booths, LED Tunnels, and high-energy entertainment.',
};

const planningSteps = [
  { title: '1. Choose Your Theme', description: "Let us know your prom's theme, and we'll help select entertainment that matches the vibe perfectly." },
  { title: '2. Select Epic Experiences', description: "Pick from student favorites like the 360 Photo Booth for amazing videos and the LED Tunnel for a grand entrance." },
  { title: '3. Enjoy the Night', description: "Our professional team will set up, operate, and ensure everyone has a safe and fantastic time, making it a night to remember." },
];

const recommendedServiceIds = ['360-photo-booth', 'led-tunnel-neon-tubes', 'magic-mirror', 'custom-monogram'];

const faqItems = [
  { question: "What is the most popular service for proms?", answer: "The 360 Photo Booth is by far the most popular choice for proms and homecomings. It creates instantly shareable videos that students love." },
  { question: "Is your equipment safe for a high school event?", answer: "Absolutely. All our equipment is professional grade and operated by a trained attendant who ensures safe and proper use throughout the event." },
  { question: "Can you incorporate our school's name or prom theme?", answer: "Yes! We can create custom video overlays for the 360 Photo Booth, project a custom monogram with your school's logo, and even set the LED Tunnel to your school colors." },
  { question: "How much space do you need for setup?", answer: "The space required varies by service. A 360 Photo Booth typically needs a 10x10 foot area, while the LED Tunnel is modular. We'll coordinate with your venue to ensure a perfect fit." },
];

const testimonials = [
  { text: "The LED Tunnel entrance was absolutely insane! Everyone felt like a celebrity walking into prom.", author: "Jessica P.", event: "Senior Prom Committee" },
  { text: "We had the 360 Photo Booth at our homecoming, and it was the highlight of the night. The line for it was long all evening!", author: "Mr. Davis, Faculty Advisor", event: "Homecoming Dance" },
  { text: "UREVENT 360 was so professional and easy to work with. They made our prom entertainment planning a breeze.", author: "Chloe M.", event: "Junior Prom President" },
];

const pageContent = `
## The Ultimate Prom & Homecoming Experience

Prom night is a landmark event in a high school student's life. Make it truly memorable with cutting-edge entertainment from UREVENT 360 PLUS. We provide the 'wow' factor that elevates your school dance from just a party to an epic experience. Our team is experienced in working with schools and committees in the Orlando area to create safe, fun, and unforgettable nights.

Imagine students making their grand entrance through a futuristic LED Tunnel, pulsing with your school colors. Picture them capturing incredible videos for TikTok and Instagram in our 360 Photo Booth, the most requested prom service. Our interactive Magic Mirror offers another layer of fun with group selfies and digital props. We can even project your school crest or prom theme as a custom monogram on the dance floor. Let's work together to create a prom night that students will be talking about until graduation.
`;

export default function PromEntertainmentPage() {
  return (
    <PillarPageLayout
      heroTitle="Orlando Prom & Homecoming Entertainment"
      heroSubtitle="Create an unforgettable night with our spectacular photo booths, LED tunnels, and more."
      heroImageUrl="https://picsum.photos/seed/orlando-prom/1920/1080"
      planningSteps={planningSteps}
      recommendedServiceIds={recommendedServiceIds}
      pageContent={pageContent}
      faqItems={faqItems}
      testimonials={testimonials}
    />
  );
}
