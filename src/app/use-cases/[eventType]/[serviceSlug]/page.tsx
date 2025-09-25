import * as React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import servicesCatalog from '@/lib/services-catalog.json';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, GalleryHorizontal } from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: { eventType: string; serviceSlug: string };
};

// Helper to format slugs into readable text
const formatSlug = (slug: string) => {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};

// --- METADATA GENERATION ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eventType, serviceSlug } = params;
  const service = servicesCatalog.services.find(s => s.slug === serviceSlug);
  const formattedEventType = formatSlug(eventType);

  if (!service) {
    return {
      title: 'Use Case Not Found',
      description: 'The requested combination of service and event could not be found.',
    };
  }

  const serviceName = service.title;
  const title = `${serviceName} for ${formattedEventType}s in Orlando`;
  const description = `Discover the benefits of our ${serviceName} for your ${formattedEventType.toLowerCase()} in Orlando. We provide a seamless experience to make your event unforgettable. Contact us for a quote!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: service.heroImage,
          width: 800,
          height: 600,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [service.heroImage],
    },
  };
}

// --- PAGE COMPONENT ---
export default function UseCasePage({ params }: Props) {
  const { eventType, serviceSlug } = params;
  const service = servicesCatalog.services.find(s => s.slug === serviceSlug);

  if (!service) {
    notFound();
  }

  const formattedEventType = formatSlug(eventType);
  const title = `${service.title} for ${formattedEventType}s`;
  
  // Placeholder content - this could be expanded with more dynamic data
  const benefits = [
    `Creates unforgettable, shareable moments for your guests.`,
    `Fully customizable to match your ${formattedEventType.toLowerCase()}'s theme and style.`,
    `Includes a professional on-site attendant to ensure everything runs smoothly.`,
    `A perfect ice-breaker that gets guests of all ages involved and having fun.`
  ];

  const galleryImages = [
    { url: `https://picsum.photos/seed/${serviceSlug}1/600/400`, alt: `${service.title} at a ${formattedEventType}` },
    { url: `https://picsum.photos/seed/${serviceSlug}2/600/400`, alt: `Guests enjoying ${service.title}` },
    { url: `https://picsum.photos/seed/${serviceSlug}3/600/400`, alt: `Custom setup for ${service.title}` },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex h-[50vh] w-full items-center justify-center bg-gray-800 text-center text-white">
        <Image
          src={service.heroImage}
          alt={title}
          fill
          priority
          className="object-cover brightness-50"
        />
        <div className="relative z-10 mx-auto max-w-4xl p-4">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-white drop-shadow-lg md:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white drop-shadow-sm md:text-xl">
            Elevate your {formattedEventType.toLowerCase()} in Orlando with a unique and engaging experience.
          </p>
           <Button size="lg" className="mt-8 bg-accent font-bold text-accent-foreground hover:bg-accent/90" asChild>
            <Link href="/contact">
              Check Availability for Your Date
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center font-headline text-3xl font-bold text-primary md:text-4xl">
              Why Choose {service.title} for Your {formattedEventType}?
            </h2>
            <ul className="mt-8 space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-lg text-foreground/80">{benefit}</span>
                </li>
              ))}
            </ul>
             <div className="text-center mt-8">
               <Button size="lg" asChild>
                 <Link href={`/services/${service.slug}`}>View Full Service Details</Link>
               </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Gallery Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
           <h2 className="text-center font-headline text-3xl font-bold text-primary md:text-4xl mb-12 flex items-center justify-center gap-3">
              <GalleryHorizontal />
              Inspiration Gallery
            </h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((image, index) => (
                    <Card key={index} className="overflow-hidden shadow-lg">
                        <div className="relative aspect-video">
                            <Image src={image.url} alt={image.alt} fill className="object-cover"/>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
      </section>

       {/* Final CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">
            Ready to Book a {service.title}?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
            Let's make your {formattedEventType.toLowerCase()} unforgettable. Contact us today for a personalized quote.
          </p>
          <Button size="lg" className="mt-8 bg-white text-primary hover:bg-white/90 font-bold" asChild>
            <Link href="/contact">
              Get Your Free Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

// This function can be used by Next.js to pre-render these pages at build time.
// It's optional but good for performance.
export async function generateStaticParams() {
  const useCases = [
    { eventType: 'wedding', serviceSlug: '360-photo-booth' },
    { eventType: 'wedding', serviceSlug: 'led-tunnel-neon-tubes' },
    { eventType: 'quinceanera', serviceSlug: 'la-hora-loca-led-robot' },
    { eventType: 'corporate', serviceSlug: 'led-screen-wall' },
    { eventType: 'birthday', serviceSlug: 'champagne-dress-hostess' },
  ];

  return useCases;
}
