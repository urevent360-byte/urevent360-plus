
'use client';

// Safely import JSON data with fallbacks
let footerData: any;
try {
  footerData = require('@/lib/footer-data.json');
} catch (e) {
  footerData = { contact: { phones: [] }, social: {} };
}

let servicesCatalog: any;
try {
  servicesCatalog = require('@/lib/services-catalog.json');
} catch (e) {
  servicesCatalog = { services: [] };
}


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://urevent360.com';

export function JsonLd() {
  const activeServices = (servicesCatalog.services || []).filter((service: any) => service.active);

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'UREVENT 360 PLUS',
    url: siteUrl,
    telephone: footerData.contact?.phones?.[0]?.number?.replace(/\D/g, '') || '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '', // Not provided, left empty
      addressLocality: 'Orlando',
      addressRegion: 'FL',
      postalCode: '32801',
      addressCountry: 'US',
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Orlando',
      },
      {
        '@type': 'City',
        name: 'Kissimmee',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Central Florida',
      },
    ],
    sameAs: [
      footerData.social?.instagram,
      footerData.social?.facebook,
    ].filter(Boolean),
    makesOffer: {
      '@type': 'OfferCatalog',
      name: 'Event Entertainment Services',
      itemListElement: activeServices.map((service: any) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.shortDescription,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  );
}
