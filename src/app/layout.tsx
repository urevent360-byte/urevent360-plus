import './globals.css';
import Providers from './Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { AppLayoutClient } from '@/components/layout/AppLayoutClient';
import { JsonLd } from '@/components/shared/JsonLd';
import brandingData from '@/lib/branding.json';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const logoUrl: string | null = (brandingData as any)?.logoUrl || null;
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body>
        <Providers>
          <AppLayoutClient logoUrl={logoUrl}>{children}</AppLayoutClient>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
