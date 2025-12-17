
import './globals.css';
import { JsonLd } from '@/components/shared/JsonLd';
import Providers from './Providers';
import brandingData from '@/lib/branding.json';


export const metadata = {
  title: {
    default: 'UREVENT 360 PLUS | Orlando Event Entertainment & Planning',
    template: '%s | UREVENT 360 PLUS',
  },
  description:
    'Top-rated Orlando event services: 360 photo booths, La Hora Loca, LED robots, LED video walls, elegant weddings, quinceañeras & corporate events.',
  keywords: ['orlando event planner', '360 photo booth orlando', 'hora loca orlando', 'wedding entertainment', 'quinceañera entertainment'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002'),
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const logoUrl: string | null = (brandingData as any)?.logoUrl || null;
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body>
          <Providers logoUrl={logoUrl}>
            {children}
          </Providers>
      </body>
    </html>
  );
}
