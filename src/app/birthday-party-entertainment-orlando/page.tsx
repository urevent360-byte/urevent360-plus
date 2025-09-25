
import { PillarPageLayout } from '@/components/page/pillar/PillarPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Birthday Party Entertainment Orlando | Photo Booths & Party Fun',
  description: 'Throw an epic birthday party in Orlando for any age with UREVENT 360 PLUS. Choose from 360 or Magic Mirror photo booths, La Hora Loca, and more!',
};

const planningSteps = [
  { title: '1. Pick a Theme', description: "Tell us about the birthday person and the party theme. We'll help you pick the perfect entertainment to match." },
  { title: '2. Choose Your Fun', description: "Select from guest favorites like our 360 photo booth for amazing videos or the Magic Mirror for hilarious selfies." },
  { title: '3. Party Time!', description: "Our team arrives, sets up, and makes sure everyone has a fantastic time, creating memories that last." },
];

const recommendedServiceIds = ['360-photo-booth', 'magic-mirror', 'la-hora-loca-led-robot', 'cold-sparklers'];

const faqItems = [
  { question: "What is the most popular entertainment for a milestone birthday (30th, 40th, 50th)?", answer: "The 360 Photo Booth is definitely a crowd-pleaser for big birthdays. For high-energy parties, La Hora Loca is also a huge hit to get everyone dancing and celebrating." },
  { question: "Do your packages include an attendant?", answer: "Yes, all of our interactive entertainment services, like the photo booths and Hora Loca, come with a professional and friendly on-site attendant to ensure everything runs smoothly." },
  { question: "Can we get digital copies of the photos and videos after the party?", answer: "Absolutely! After the event, we provide you with a digital gallery of all the photos and videos taken, so you can relive the fun and share with friends and family." },
  { question: "Are your services suitable for kids' birthday parties too?", answer: "Yes! The Magic Mirror is especially fun for kids with its interactive animations and drawing features. We can tailor the experience to be age-appropriate and fun for everyone." }
];

const testimonials = [
  { text: "The Magic Mirror was the life of my 30th birthday party. My friends and I had so much fun with the props and signing our pictures.", author: "Amanda B.", event: "30th Birthday Party" },
  { text: "My son's 21st birthday was unforgettable thanks to the 360 booth. The videos were all over social media for weeks!", author: "Linda R.", event: "Son's 21st Birthday" },
  { text: "La Hora Loca brought so much energy to my husband's 50th birthday bash. It got everyone, from the kids to the grandparents, on the dance floor.", author: "Karen W.", event: "Husband's 50th Birthday" },
];

const pageContent = `
## Celebrate Any Age in Style

Birthdays are milestones worth celebrating, and the right entertainment can turn any party into an unforgettable event. UREVENT 360 PLUS offers a wide range of entertainment options perfect for birthday parties of all ages in Orlando, from a child's first birthday to a 50th anniversary bash. We bring the fun, so you can focus on the guest of honor.

Our interactive photo booths, like the 360 Photo Booth and Magic Mirror, are always a hit, providing endless fun and instant social media-worthy content. Want to take the energy to the next level? La Hora Loca will get everyone on their feet, dancing and laughing with our LED Robot and performers. For a touch of glamour, consider our Cold Sparklers for a dramatic cake-cutting moment or a grand entrance. No matter the age or theme, we have the perfect entertainment to make your next birthday party the talk of the town.
`;

export default function BirthdayPartyEntertainmentPage() {
  return (
    <PillarPageLayout
      heroTitle="Birthday Party Entertainment in Orlando"
      heroSubtitle="Celebrate your next milestone with entertainment that will have everyone talking."
      heroImageUrl="https://picsum.photos/seed/orlando-birthday/1920/1080"
      planningSteps={planningSteps}
      recommendedServiceIds={recommendedServiceIds}
      pageContent={pageContent}
      faqItems={faqItems}
      testimonials={testimonials}
    />
  );
}
