import type { Metadata } from 'next';
import './globals.css';

import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { AppLayoutClient } from '@/components/layout/AppLayoutClient';
import { JsonLd } from '@/components/shared/JsonLd';
import brandingData from '@/lib/branding.json';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import Providers from './Providers';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://urevent360.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Event Entertainment & Photo Booths in Orlando | UREVENT 360 PLUS',
  description:
    'Premium event entertainment in Orlando & Central Florida: 360 photo booth, LED tunnel, LED walls, La Hora Loca, cold sparklers, champagne hostess & more.',
  alternates: {
    // canonical relative to metadataBase
    canonical: '/',
  },
  openGraph: {
    title: 'UREVENT 360 PLUS — Event Entertainment in Orlando',
    description:
      '360 photo booth, LED tunnel, La Hora Loca, LED screens, special welcomes & effects. Serving Orlando & Central Florida.',
    url: '/',
    siteName: 'UREVENT 360 PLUS',
    images: [
      {
        url: '/og-image.png', // resolved via metadataBase
        width: 1200,
        height: 630,
        alt: 'Guests enjoying a 360 photo booth at an Orlando event.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UREVENT 360 PLUS — Event Entertainment in Orlando',
    description:
      '360 photo booth, LED tunnel, La Hora Loca, LED screens, special welcomes & effects. Serving Orlando & Central Florida.',
    images: ['/og_image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

async function getLogoUrl(): Promise<string | null> {
  // Safe access to branding data
  let raw: string | null = null;
  try {
      raw = (brandingData as { logoUrl?: string | null })?.logoUrl;
  } catch (e) {
      console.error("Could not parse branding.json, continuing without custom logo.", e);
      return null;
  }
  
  if (!raw) return null;
  if (!/^https?:\/\//i.test(raw)) {
    // resolve relative path to absolute
    const base = getBaseUrl();
    const path = raw.startsWith('/') ? raw : `/${raw}`;
    return `${base}${path}`;
  }
  return raw;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logoUrl = await getLogoUrl();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Consider migrating to next/font for better CLS & performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <JsonLd />
      </head>
      <body className={cn('font-body antialiased')}>
        <Providers>
          <FirebaseErrorListener />
          <AppLayoutClient logoUrl={logoUrl}>
            {children}
          </AppLayoutClient>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
