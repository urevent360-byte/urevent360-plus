
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function AppLayoutClient({ children, logoUrl }: { children: React.ReactNode, logoUrl: string | null }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const isAppRoute = pathname.startsWith('/app');
  const isAuthRoute = pathname.startsWith('/admin/login') || pathname.startsWith('/app/login') || pathname.startsWith('/app/register') || pathname.startsWith('/admin/forgot-password') || pathname.startsWith('/app/forgot-password');

  if (isAdminRoute || isAppRoute || isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header logoUrl={logoUrl} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
