
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

export function AppLayoutClient({ children, logoUrl }: { children: React.ReactNode, logoUrl: string | null }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const isAppRoute = pathname.startsWith('/app');
  const isAuthRoute = isAdminRoute || isAppRoute;

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header logoUrl={logoUrl} />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
