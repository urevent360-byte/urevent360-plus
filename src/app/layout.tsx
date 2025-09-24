
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { AppLayoutClient } from '@/components/layout/AppLayoutClient';
import fs from 'fs/promises';
import path from 'path';

export const metadata: Metadata = {
  title: 'UREVENT 360 PLUS',
  description: 'Your premier event planning partner for unforgettable experiences.',
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
      </head>
      <body className={cn('font-body antialiased')}>
        <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <AppLayoutClient logoUrl={logoUrl}>{children}</AppLayoutClient>
            </div>
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
