
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { InquiryModal } from '../page/home/InquiryModal';
import { RoyalInquiryModal } from '../page/home/RoyalInquiryModal';
import { Toaster } from '../ui/toaster';

const portalRoutes = ['/admin', '/app'];

export function AppLayoutClient({ children, logoUrl }: { children: React.ReactNode, logoUrl: string | null }) {
  const pathname = usePathname() ?? '';
  const isPortalRoute = portalRoutes.some(route => pathname.startsWith(route));

  if (isPortalRoute) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header logoUrl={logoUrl} />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer />
      <InquiryModal />
      <RoyalInquiryModal />
      <Toaster />
    </div>
  );
}
