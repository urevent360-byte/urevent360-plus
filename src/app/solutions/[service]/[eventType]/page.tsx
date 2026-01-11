

'use server';

import * as React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, GalleryHorizontal } from 'lucide-react';
import servicesCatalog from '@/lib/services-catalog.json';

type Props = {
  // IMPORTANT (Next 15 in this environment): params is a Promise
  params: Promise<{ service: string; eventType: string }>;
};

const CITY_NAME = 'Orlando';
const QUOTE_PATH = '/plan';

const formatSlug = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

function ServiceSchema({
  service,
  eventType,
}: {
  service: (typeof servicesCatalog.services)[0];
  eventType: string;
}) {
  const formattedEventType = formatSlug(eventType);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.title,
    name: `${service.title} for ${formattedEventType}s`,
    description: service.longDescription,
    provider: {
      '@type': 'LocalBusiness',
      name: 'UREVENT 360 PLUS',
    },
    areaServed: {
      '@type': 'City',
      name: CITY_NAME,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: serviceSlug, eventType } = await params;
  const service = servicesCatalog.services.find((s) => s.slug === serviceSlug);

  if (!service) {
    return {
      title: 'Solution Not Found',
      description: 'The requested combination of service and event could not be found.',
    };
  }

  const formattedEventType = formatSlug(eventType);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
  const canonicalUrl = `${siteUrl}/solutions/${serviceSlug}/${eventType}`;

  const title = `${service.title} for ${formattedEventType}s in ${CITY_NAME}`;
  const description = `Discover why our ${service.title} is the perfect addition for your ${formattedEventType.toLowerCase()} in ${CITY_NAME}. Create unforgettable moments. Contact us for a quote!`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
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

export default async function SolutionPage({ params }: Props) {
  const { service: serviceSlug, eventType } = await params;

  const service = servicesCatalog.services.find((s) => s.slug === serviceSlug);
  if (!service) {
    notFound();
  }

  const formattedEventType = formatSlug(eventType);
  const title = `${service.title} for ${formattedEventType}s`;

  const benefits = [
    `Creates unforgettable, shareable moments for guests at your ${formattedEventType}.`,
    `Fully customizable to match your ${formattedEventType.toLowerCase()}'s unique theme and style.`,
    `Includes a professional on-site attendant to ensure everything runs smoothly.`,
    `A perfect ice-breaker that gets guests of all ages involved and having fun.`,
  ];

  const galleryImages = [
    {
      url: `https://picsum.photos/seed/${serviceSlug}-${eventType}-1/600/400`,
      alt: `${service.title} at a ${formattedEventType}`,
    },
    {
      url: `https://picsum.photos/seed/${serviceSlug}-${eventType}-2/600/400`,
      alt: `Guests enjoying ${service.title}`,
    },
    {
      url: `https://picsum.photos/seed/${serviceSlug}-${eventType}-3/600/400`,
      alt: `Custom setup for ${service.title}`,
    },
  ];

  return (
    <div className="flex flex-col">
      <ServiceSchema service={service} eventType={eventType} />

      {/* Hero */}
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
            {`Elevate your ${formattedEventType.toLowerCase()} in ${CITY_NAME} with a unique and engaging experience.`}
          </p>
          <Button
            size="lg"
            className="mt-8 bg-accent font-bold text-accent-foreground hover:bg-accent/90"
            asChild
          >
            <Link href={QUOTE_PATH}>
              {`Get a Quote for Your ${formattedEventType}`}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-headline text-3xl font-bold text-primary md:text-4xl">
              {`Why Choose ${service.title} for Your ${formattedEventType}?`}
            </h2>

            <ul className="mt-8 space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-green-500" />
                  <span className="text-lg text-foreground/80">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 text-center">
              <Button size="lg" asChild>
                <Link href={`/services/${service.slug}`}>View Full Service Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 flex items-center justify-center gap-3 text-center font-headline text-3xl font-bold text-primary md:text-4xl">
            <GalleryHorizontal />
            {`${formattedEventType} Inspiration Gallery`}
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image) => (
              <div key={image.url} className="overflow-hidden rounded-lg shadow-lg">
                <div className="relative aspect-video">
                  <Image src={image.url} alt={image.alt} fill className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">
            {`Ready to Book a ${service.title}?`}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
            {`Let's make your ${formattedEventType.toLowerCase()} unforgettable. Contact us today for a personalized quote.`}
          </p>
          <Button
            size="lg"
            className="mt-8 bg-white font-bold text-primary hover:bg-white/90"
            asChild
          >
            <Link href={QUOTE_PATH}>
              Get Your Free Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { service: 'led-tunnel-neon-tubes', eventType: 'wedding' },
    { service: 'led-tunnel-neon-tubes', eventType: 'corporate' },
    { service: 'la-hora-loca-led-robot', eventType: 'quinceanera' },
    { service: '360-photo-booth', eventType: 'wedding' },
  ];
}
