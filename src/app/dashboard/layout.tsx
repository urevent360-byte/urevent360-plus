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
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const pathname = usePathname();

  const t = {
    dashboard: { en: 'Dashboard', es: 'Panel' },
    bookings: { en: 'My Bookings', es: 'Mis Reservas' },
    gallery: { en: 'My Gallery', es: 'Mi Galería' },
    music: { en: 'Music Playlist', es: 'Playlist de Música' },
    payments: { en: 'Payments', es: 'Pagos' },
    profile: { en: 'My Profile', es: 'Mi Perfil' },
    backToSite: { en: 'Back to Main Site', es: 'Volver al Sitio Principal' },
  };

  const menuItems = [
    { href: '/dashboard', icon: <LayoutGrid />, label: t.dashboard[language] },
    { href: '/dashboard/bookings', icon: <Calendar />, label: t.bookings[language] },
    { href: '/dashboard/gallery', icon: <Camera />, label: t.gallery[language] },
    { href: '/dashboard/music', icon: <Music />, label: t.music[language] },
    { href: '/dashboard/payments', icon: <CreditCard />, label: t.payments[language] },
    { href: '/dashboard/profile', icon: <User />, label: t.profile[language] },
    { isSeparator: true },
    { href: '/', icon: <Home />, label: t.backToSite[language] },
  ];

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
            {menuItems.map((item, index) => 
                item.isSeparator ? <SidebarMenuItem key={index}></SidebarMenuItem> : (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href!}>
                      {item.icon}
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
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
