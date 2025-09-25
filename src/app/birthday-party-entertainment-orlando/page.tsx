import { PillarPageLayout } from '@/components/page/pillar/PillarPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Birthday Party Entertainment Orlando | Photo Booths & Party Fun',
  description: 'Throw an epic birthday party in Orlando with UREVENT 360 PLUS. Choose from 360 or Magic Mirror photo booths, La Hora Loca, and more!',
};

const planningSteps = [
  { title: '1. Pick a Theme', description: "Tell us about the birthday person and the party theme. We'll help you pick the perfect entertainment to match." },
  { title: '2. Choose Your Fun', description: "Select from guest favorites like our 360 photo booth for amazing videos or the Magic Mirror for hilarious selfies." },
  { title: '3. Party Time!', description: "Our team arrives, sets up, and makes sure everyone has a fantastic time, creating memories that last." },
];

const recommendedServiceIds = ['360-photo-booth', 'magic-mirror', 'la-hora-loca-led-robot'];

const faqItems = [
  { question: "What is the most popular entertainment for a milestone birthday?", answer: "The 360 Photo Booth is definitely a crowd-pleaser for big birthdays like a Sweet 16, 21st, 30th, or 50th. For high-energy parties, La Hora Loca is also a huge hit." },
  { question: "Do your packages include an attendant?", answer: "Yes, all of our interactive entertainment services, like the photo booths and Hora Loca, come with a professional and friendly on-site attendant to ensure everything runs smoothly." },
  { question: "Can we get digital copies of the photos and videos after the party?", answer: "Absolutely! After the event, we provide you with a digital gallery of all the photos and videos taken, so you can relive the fun and share with friends and family." },
];

const testimonials = [
  { text: "The Magic Mirror was the life of my 30th birthday party. My friends and I had so much fun with the props and signing our pictures.", author: "Amanda B.", event: "30th Birthday Party" },
  { text: "My son's Sweet 16 was unforgettable thanks to the 360 booth. The videos were all over social media for weeks!", author: "Linda R.", event: "Son's Sweet 16" },
  { text: "La Hora Loca brought so much energy to my husband's 50th birthday bash. It got everyone, from the kids to the grandparents, on the dance floor.", author: "Karen W.", event: "Husband's 50th Birthday" },
];

export default function BirthdayPartyEntertainmentPage() {
  return (
    <PillarPageLayout
      heroTitle="Birthday Party Entertainment in Orlando"
      heroSubtitle="Celebrate your next milestone with entertainment that will have everyone talking."
      heroImageUrl="https://picsum.photos/seed/orlando-birthday/1920/1080"
      planningSteps={planningSteps}
      recommendedServiceIds={recommendedServiceIds}
      faqItems={faqItems}
      testimonials={testimonials}
    />
  );
}
