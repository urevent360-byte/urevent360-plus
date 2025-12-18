

'use server';

import * as React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, ArrowUpRight, MapPin, Users, Lightbulb, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import venuesData from '@/lib/venues-data.json';
import servicesCatalog from '@/lib/services-catalog.json';
import { Separator } from '@/components/ui/separator';

type Props = {
  params: { slug: string };
};

const { venues } = venuesData;

// --- METADATA AND JSON-LD ---

function VenueSchema({ venue }: { venue: (typeof venues)[0] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: venue.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.address.street,
      addressLocality: venue.address.city,
      addressRegion: venue.address.state,
      postalCode: venue.address.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: venue.geo.latitude,
      longitude: venue.geo.longitude,
    },
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/venues/${venue.slug}`,
    telephone: venue.phone,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const venue = venues.find(v => v.slug === params.slug);

  if (!venue) {
    return {
      title: 'Venue Not Found',
    };
  }

  const title = `Event Entertainment at ${venue.name} | UREVENT 360 PLUS`;
  const description = `Discover the best entertainment services like 360 Photo Booths and LED Tunnels for your event at ${venue.name}, Orlando. See past events and compatible services.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [venue.heroImage],
    },
  };
}

// --- PAGE COMPONENT ---
export default async function VenuePage({ params }: { params: Promise<any> }) {
    const { slug } = await params;
    const venue = venues.find(v => v.slug === slug);
  
    if (!venue) {
      notFound();
    }
    
    const compatibleServices = servicesCatalog.services.filter(s => venue.compatibleServices.includes(s.id));
  
    return (
      <div className="flex flex-col">
         <VenueSchema venue={venue} />
  
        {/* Hero Section */}
        <section className="relative flex h-[50vh] w-full items-center justify-center bg-gray-800 text-center text-white">
          <Image
            src={venue.heroImage}
            alt={`Event at ${venue.name}`}
            fill
            priority
            className="object-cover brightness-50"
          />
          <div className="relative z-10 mx-auto max-w-4xl p-4">
            <p className="font-semibold text-accent">Venue Spotlight</p>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-white drop-shadow-lg md:text-6xl">
              {venue.name}
            </h1>
            <p className="mt-2 text-lg opacity-90">
               {venue.address.street}, {venue.address.city}, {venue.address.state} {venue.address.zip}
            </p>
            <Button size="lg" className="mt-8 bg-accent font-bold text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/contact">
                Plan Your Event at {venue.name}
              </Link>
            </Button>
          </div>
        </section>
  
        {/* Details Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                 <div>
                    <h2 className="font-headline text-3xl font-bold text-primary mb-4">About {venue.name}</h2>
                    <p className="text-lg text-foreground/80">{venue.description}</p>
                     <Button variant="link" asChild className="px-0">
                      <a href={venue.websiteUrl} target="_blank" rel="noopener noreferrer">Visit Venue Website <ExternalLink className="ml-2"/></a>
                     </Button>
                 </div>
                 <Separator />
                 <div>
                    <h3 className="font-headline text-2xl font-bold text-primary mb-4">Recommended Services</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {compatibleServices.map(service => (
                         <Link href={`/services/${service.slug}`} key={service.id}>
                          <Card className="h-full hover:shadow-md transition-shadow text-center">
                              <Image src={service.heroImage} alt={service.label} width={200} height={150} className="rounded-t-lg object-cover aspect-video w-full" />
                              <p className="text-xs font-semibold p-2">{service.label}</p>
                          </Card>
                        </Link>
                      ))}
                    </div>
                 </div>
              </div>
              <div className="space-y-6">
                  <Card>
                    <CardHeader><CardTitle className="text-xl">Venue Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div className="flex items-center gap-3"><Users /><p>Capacity: Up to {venue.capacity} guests</p></div>
                      <div className="flex items-center gap-3"><ArrowUpRight /><p>Ceiling: {venue.ceilingHeight}</p></div>
                      <div className="flex items-center gap-3"><Zap /><p>Power: {venue.powerInfo}</p></div>
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader><CardTitle className="text-xl">Effects Policy</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {venue.effectsPolicy.map(policy => (
                        <Badge key={policy.effect} variant={policy.allowed ? 'default' : 'destructive'} className="mr-2 mb-2">
                          {policy.effect}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                  <Card>
                     <CardHeader><CardTitle className="text-xl flex items-center gap-2"><MapPin/> Location</CardTitle></CardHeader>
                     <CardContent className="aspect-video">
                      <iframe
                          src={venue.mapEmbedUrl}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen={false}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                     </CardContent>
                  </Card>
              </div>
            </div>
          </div>
        </section>
  
      </div>
    );
}
    
export async function generateStaticParams() {
  return venues.map((venue) => ({
    slug: venue.slug,
  }));
}
