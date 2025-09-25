
'use client';

import footerData from '@/lib/footer-data.json';
import servicesCatalog from '@/lib/services-catalog.json';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://urevent360.com';

export function JsonLd() {
  const activeServices = servicesCatalog.services.filter(service => service.active);

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'UREVENT 360 PLUS',
    url: siteUrl,
    telephone: footerData.contact.phones[0]?.number.replace(/\D/g, '') || '',
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
      footerData.social.instagram,
      footerData.social.facebook,
    ].filter(url => url && url !== '#'),
    makesOffer: {
      '@type': 'OfferCatalog',
      name: 'Event Entertainment Services',
      itemListElement: activeServices.map(service => ({
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
