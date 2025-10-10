
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { AppLayoutClient } from '@/components/layout/AppLayoutClient';
import fs from 'fs/promises';
import path from 'path';
import { JsonLd } from '@/components/shared/JsonLd';
import { ChatWidget } from '@/components/shared/ChatWidget';
import { InquiryModal } from '@/components/page/home/InquiryModal';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://urevent360.com';
const ogImageUrl = `${siteUrl}/og-image.png`; // Assuming a default OG image exists at this path

export const metadata: Metadata = {
  title: 'Event Entertainment & Photo Booths in Orlando | UREVENT 360 PLUS',
  description: 'Premium event entertainment in Orlando & Central Florida: 360 photo booth, LED tunnel, LED walls, La Hora Loca, cold sparklers, champagne hostess & more.',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'UREVENT 360 PLUS — Event Entertainment in Orlando',
    description: '360 photo booth, LED tunnel, La Hora Loca, LED screens, special welcomes & effects. Serving Orlando & Central Florida.',
    url: siteUrl,
    siteName: 'UREVENT 360 PLUS',
    images: [
      {
        url: ogImageUrl,
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
    description: '360 photo booth, LED tunnel, La Hora Loca, LED screens, special welcomes & effects. Serving Orlando & Central Florida.',
    images: [ogImageUrl],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

const getBaseUrl = () => process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:9002';

async function getLogoUrl() {
    const brandingPath = path.join(process.cwd(), 'public', 'branding.json');
    try {
        const data = await fs.readFile(brandingPath, 'utf-8');
        const branding = JSON.parse(data);
        const logoUrl = branding.logoUrl;
        if (logoUrl && !logoUrl.startsWith('http')) {
            return `${getBaseUrl()}${logoUrl}`;
        }
        return logoUrl;
    } catch (error) {
        return null;
    }
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <JsonLd />
      </head>
      <body className={cn('font-body antialiased')}>
        <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <AppLayoutClient logoUrl={logoUrl}>{children}</AppLayoutClient>
            </div>
            <Toaster />
            <InquiryModal />
        </AuthProvider>
      </body>
    </html>
  );
}
