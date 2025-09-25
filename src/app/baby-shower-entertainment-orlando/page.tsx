
import { PillarPageLayout } from '@/components/page/pillar/PillarPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Baby Shower Entertainment & Ideas Orlando | UREVENT 360 PLUS',
  description: 'Host a beautiful and fun baby shower in Orlando. We offer elegant photo booths, custom backdrops, and monogram projections to celebrate the parents-to-be.',
};

const planningSteps = [
  { title: '1. Choose a Theme', description: "Share your baby shower theme with us, whether it's 'Twinkle, Twinkle, Little Star' or 'Oh Boy!', and we'll match our services." },
  { title: '2. Select Your Decor & Fun', description: "Choose our Magic Mirror photo booth for fun keepsakes, or a custom monogram projection to personalize the space." },
  { title: '3. Celebrate the Arrival', description: "Our team handles the setup and operation, allowing you and your guests to focus on celebrating the upcoming arrival." },
];

const recommendedServiceIds = ['magic-mirror', 'photo-booth-printer', 'custom-monogram'];

const faqItems = [
  { question: "What's a good entertainment option for a baby shower?", answer: "Our Magic Mirror photo booth is a fantastic choice. It's less about high energy and more about creating beautiful, fun keepsakes. Guests of all ages love the easy-to-use interface and instant prints." },
  { question: "Can you customize the photo prints for the baby shower?", answer: "Yes! We can design the photo strips with the baby's name, the shower date, and match the colors and graphics to your theme. It's a perfect party favor." },
  { question: "What is a monogram projection and how can it be used for a baby shower?", answer: "We can project the baby's name, initials, or a cute phrase like 'Oh Baby!' onto a feature wall or the floor. It creates a beautiful, custom focal point for your event decor." },
  { question: "Is the equipment bulky? Our venue is small.", answer: "The Magic Mirror has a surprisingly small footprint and can fit into most spaces easily. We always coordinate with the venue beforehand to ensure a smooth setup." },
];

const testimonials = [
  { text: "The Magic Mirror was such a classy and fun addition to my sister's baby shower. The custom prints were adorable!", author: "Emily R.", event: "Sister's Baby Shower" },
  { text: "We had 'Oh Boy!' projected on the wall, and it was the perfect touch for our pictures. UREVENT 360 was wonderful to work with.", author: "Megan T.", event: "Baby Shower" },
  { text: "I wasn't sure about entertainment for a baby shower, but the photo booth was a huge hit. It gave guests a fun activity to do.", author: "Sarah L.", event: "Friend's Baby Shower" },
];

const pageContent = `
## Celebrate in Style: Orlando Baby Shower Entertainment

A baby shower is a heartwarming celebration of new life and growing families. While the focus is on the parents-to-be, adding a touch of elegant entertainment can make the day even more memorable for everyone. UREVENT 360 PLUS offers sophisticated and fun options that are perfectly suited for baby showers and gender reveal parties in the Orlando area.

Our Magic Mirror photo booth is a guest favorite, offering a user-friendly experience that allows guests of all ages to capture beautiful, high-quality photos. We customize the prints to match your theme, creating a wonderful keepsake for guests to take home. To further personalize your event space, we can project a custom monogram with the baby's name or a sweet message like "Welcome Little One." Our services are designed to complement your decor and add a layer of interactive fun, without disrupting the intimate and joyful atmosphere of your celebration.
`;

export default function BabyShowerEntertainmentPage() {
  return (
    <PillarPageLayout
      heroTitle="Elegant Baby Shower Entertainment in Orlando"
      heroSubtitle="Add a touch of magic to your celebration with our beautiful photo booths and custom decor."
      heroImageUrl="https://picsum.photos/seed/orlando-babyshower/1920/1080"
      planningSteps={planningSteps}
      recommendedServiceIds={recommendedServiceIds}
      pageContent={pageContent}
      faqItems={faqItems}
      testimonials={testimonials}
    />
  );
}
