'use client';

import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutGrid,
  Music,
  Calendar,
  CreditCard,
  User,
  Home,
  Camera,
} from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/shared/icons';
import { useLanguage } from '@/contexts/LanguageProvider';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const t = {
    dashboard: { en: 'Dashboard', es: 'Panel' },
    bookings: { en: 'My Bookings', es: 'Mis Reservas' },
    gallery: { en: 'My Gallery', es: 'Mi Galería' },
    music: { en: 'Music Preferences', es: 'Preferencias Musicales' },
    payments: { en: 'Payments', es: 'Pagos' },
    profile: { en: 'My Profile', es: 'Mi Perfil' },
    backToSite: { en: 'Back to Main Site', es: 'Volver al Sitio Principal' },
    admin: { en: 'Admin', es: 'Administración' },
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="p-2 flex justify-center">
            <Logo />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/portal">
                  <LayoutGrid />
                  {t.dashboard[language]}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/portal/bookings">
                  <Calendar />
                  {t.bookings[language]}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/portal/gallery">
                  <Camera />
                  {t.gallery[language]}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/portal/music">
                  <Music />
                  {t.music[language]}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/portal/payments">
                  <CreditCard />
                  {t.payments[language]}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/portal/profile">
                  <User />
                  {t.profile[language]}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <Home />
                  {t.backToSite[language]}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>{/* Footer content if needed */}</SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
