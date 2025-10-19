'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Settings,
  LayoutGrid,
  Newspaper,
  BookUser,
  Bot,
  Calendar,
  Camera,
  Home,
  Briefcase,
  BarChart,
  FolderKanban,
  Palette,
  User,
} from 'lucide-react';
import { Logo } from '@/components/shared/icons';
import { AuthSignOutButton } from '@/components/shared/AuthSignOutButton';
import { cn } from '@/lib/utils'; // if you don't have cn, remove and inline template strings

type NavItem = { href: string; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> };

const NAV_ITEMS: NavItem[] = [
  { href: '/admin/home', label: 'Home', icon: LayoutGrid },
  { href: '/admin/crm', label: 'CRM (Leads)', icon: BookUser },
  { href: '/admin/projects', label: 'Projects (Weekly)', icon: Briefcase },
  { href: '/admin/events', label: 'Events (List View)', icon: FolderKanban },
  { href: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/designs', label: 'Designs', icon: Palette },
  { href: '/admin/gallery', label: 'Gallery', icon: Camera },
  { href: '/admin/marketing', label: 'Marketing', icon: BarChart },
  { href: '/admin/content', label: 'Content', icon: Newspaper },
  { href: '/admin/settings/profile', label: 'My Profile', icon: User },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/assistant', label: 'AI Assistant', icon: Bot },
];

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';

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
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'justify-start',
                      active && 'bg-primary/10 text-primary hover:bg-primary/15'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Link href={href}>
                      <Icon />
                      {label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <Home />
                  Go to Site
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <AuthSignOutButton />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
