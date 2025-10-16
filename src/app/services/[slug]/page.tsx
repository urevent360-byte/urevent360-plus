
import * as React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import ServiceDetailClient from './client';
import servicesCatalog from '@/lib/services-catalog.json';

type Props = {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

const metadataMap: Record<string, { title: string; description: string }> = {
  '360-photo-booth': {
    title: '360 Photo Booth Rental Orlando | Slow-Mo 360 Videos',
    description: 'Our most popular booth—shareable slow-motion 360 videos with an on-site attendant. Perfect for weddings, quince & corporate.',
  },
  'magic-mirror': {
    title: 'Magic Mirror Photo Booth Orlando',
    description: 'Interactive full-length mirror with signatures, emojis and instant sharing. A show-stopping photo experience.',
  },
  'photo-booth-printer': {
    title: 'Photo Booth Printer Rental Orlando',
    description: 'Glossy photo strips with custom designs and unlimited sessions. Great for parties and brand activations.',
  },
  'la-hora-loca-led-robot': {
    title: 'La Hora Loca with LED Robot Orlando',
    description: 'High-energy party hour with LED robot, dancers, props and CO₂ effects to pack your dance floor.',
  },
  'cold-sparklers': {
    title: 'Cold Sparkler Fountains (Indoor-Safe) Orlando',
    description: 'Create stunning entrances and first dances with smokeless, cold spark fountains approved for indoor use.',
  },
  'dance-on-the-clouds': {
    title: 'Dance on the Clouds Orlando',
    description: 'Low-lying dry-ice cloud effect for a dreamy first dance and cinematic photos.',
  },
  'led-tunnel-neon-tubes': {
    title: 'LED Tunnel & Neon Tube Installations Orlando',
    description: 'Signature walk-through LED arches or photo backdrop with dynamic color scenes. Modular to fit your venue.',
  },
  'led-screen-wall': {
    title: 'LED Screen Wall (Video Wall) Rental Orlando',
    description: 'Seamless LED panels for stage backdrops, sponsor loops, live feeds and animated monograms.',
  },
  'projector-screen': {
    title: 'High-Quality Projector & Screen Rental Orlando',
    description: 'HD projectors and screens for slideshows, videos and presentations—delivery, setup & playback support.',
  },
  'custom-monogram': {
    title: 'Custom Monogram Projection Orlando',
    description: 'Elegant personalized monogram or logo projected on the dance floor or wall.',
  },
  'champagne-dress-hostess': {
    title: 'Champagne Dress Hostess Orlando',
    description: 'A glamorous welcome experience; themed attire and flute display for arrivals or cocktail hour.',
  },
  'welcome-bridgerton': {
    title: 'Welcome — Bridgerton Style Orlando',
    description: 'Elegant models greet and escort guests for a premium reception experience.',
  },
  'stilt-walkers': {
    title: 'Stilt Walkers (Carnival & Circus) Orlando',
    description: 'Colorful stilt performers for photos and interactive entertainment during La Hora Loca.',
  },
  'hora-loca-deluxe': {
    title: 'Hora Loca Deluxe Orlando',
    description: 'Ultimate party package with stilt performers, dancers, glow props and CO₂.',
  },
  'big-head-characters': {
    title: 'Big-Head Characters & Extra Dancers Orlando',
    description: 'Surprise appearances and extra dancers to boost crowd energy and photo moments.',
  },
  'snow-effect': {
    title: 'Snow Effect (First Dance) Orlando',
    description: 'Romantic falling-snow effect—perfect for winter-themed weddings and quinceañeras.',
  },
};


export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const service = servicesCatalog.services.find(s => s.slug === slug);
  const customMeta = metadataMap[slug];

  if (!service || !customMeta) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: customMeta.title,
    description: customMeta.description,
    openGraph: {
      title: customMeta.title,
      description: customMeta.description,
      images: [
        {
          url: service.heroImage,
          width: 800,
          height: 600,
          alt: service.title,
        },
        ...previousImages,
      ],
    },
     twitter: {
      card: 'summary_large_image',
      title: customMeta.title,
      description: customMeta.description,
      images: [service.heroImage],
    },
  };
}

function FAQPageSchema({ service }: { service: (typeof servicesCatalog.services)[0] }) {
  if (!service.faq || service.faq.length === 0) {
    return null;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}


export default function ServiceDetailPage({ params }: Props) {
    const service = servicesCatalog.services.find(s => s.slug === params.slug);
    const { slug } = params;

    return (
        <>
            {service && <FAQPageSchema service={service} />}
            <ServiceDetailClient slug={slug} />
        </>
    );
}
