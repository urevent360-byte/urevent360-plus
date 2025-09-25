
import { PillarPageLayout } from '@/components/page/pillar/PillarPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sweet 16 Party Entertainment Orlando | 360 Booth & Magic Mirror',
  description: 'Throw the best Sweet 16 in Orlando with UREVENT 360 PLUS. Our 360 Photo Booth, Magic Mirror, and custom monograms will make her day unforgettable.',
};

const planningSteps = [
  { title: '1. Her Vision', description: "We start by understanding the birthday girl's vision, from themes and colors to the vibe she wants for her party." },
  { title: '2. Choose the 'Wow'', description: "Select from our most popular Sweet 16 services, like the 360 Photo Booth for TikTok-ready videos or a custom monogram." },
  { title: '3. A Night to Remember', description: "Our team handles all the details, ensuring a seamless and spectacular party so the whole family can celebrate." },
];

const recommendedServiceIds = ['360-photo-booth', 'magic-mirror', 'cold-sparklers', 'custom-monogram'];

const faqItems = [
  { question: "What entertainment is most popular for a Sweet 16?", answer: "The 360 Photo Booth is a must-have for any Sweet 16! It creates amazing videos that are perfect for sharing on social media. The Magic Mirror is also a huge hit for group photos." },
  { question: "Can we customize the experience to match the party theme?", answer: "Definitely! We can create custom overlays for the 360 videos, custom print designs for the Magic Mirror, and project a personalized monogram with her name or 'Sweet 16'." },
  { question: "Is there an attendant with the photo booths?", answer: "Yes, every photo booth rental includes a professional and friendly attendant to assist guests, manage the equipment, and make sure everyone has a fantastic time." },
  { question: "Can you do a grand entrance with the cold sparklers?", answer: "Absolutely. The cold sparklers are perfect for making a dramatic and safe grand entrance for the birthday girl, as well as for the candle-lighting ceremony." },
];

const testimonials = [
  { text: "My daughter's Sweet 16 was the party of the year thanks to the 360 booth. All her friends were obsessed!", author: "Laura P.", event: "Daughter's Sweet 16" },
  { text: "The custom monogram was such an elegant touch and made the pictures look amazing. The team was so professional.", author: "Maria G.", event: "Sweet 16 Party" },
  { text: "UREVENT 360 made planning the entertainment so easy. The Magic Mirror was a huge success and the attendant was great with the kids.", author: "Jennifer S.", event: "Niece's Sweet 16" },
];

const pageContent = `
## An Unforgettable Sweet 16 Celebration

A Sweet 16 is more than just a birthday party; it's a rite of passage. At UREVENT 360 PLUS, we specialize in creating the modern, fun, and 'Instagrammable' experiences that make a Sweet 16 in Orlando truly unforgettable. We know what it takes to impress today's teens and create a party atmosphere that's both exciting and sophisticated.

Our 360 Photo Booth is the star of any Sweet 16, letting guests create and share incredible videos that are perfect for TikTok and Instagram. The interactive Magic Mirror provides endless fun with its animated touch screen and custom photo prints. For those truly special moments, like the grand entrance or candle lighting, our indoor-safe Cold Sparklers add a touch of Hollywood glamour. We can also project a beautiful, custom monogram with her name to personalize the space. Let us help you plan a Sweet 16 that she and her friends will cherish forever.
`;

export default function SweetSixteenEntertainmentPage() {
  return (
    <PillarPageLayout
      heroTitle="Orlando Sweet 16 Entertainment"
      heroSubtitle="Create the ultimate party with our trendy photo booths, special effects, and more."
      heroImageUrl="https://picsum.photos/seed/orlando-sweet16/1920/1080"
      planningSteps={planningSteps}
      recommendedServiceIds={recommendedServiceIds}
      pageContent={pageContent}
      faqItems={faqItems}
      testimonials={testimonials}
    />
  );
}
