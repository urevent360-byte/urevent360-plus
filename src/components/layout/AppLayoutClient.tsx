
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { InquiryModal } from '../page/home/InquiryModal';

const adminRoutes = ['/admin', '/app'];

export function AppLayoutClient({ children, logoUrl }: { children: React.ReactNode, logoUrl: string | null }) {
  const pathname = usePathname() ?? '';
  const isPortalRoute = adminRoutes.some(route => pathname.startsWith(route));

  if (isPortalRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header logoUrl={logoUrl} />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer />
      <InquiryModal />
    </div>
  );
}
