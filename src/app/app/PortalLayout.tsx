
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
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutGrid,
  Briefcase,
  Camera,
  ListTree,
  CreditCard,
  User,
  Home,
  Bot,
  FolderKanban,
  PlusSquare,
  Palette,
  Menu,
} from 'lucide-react';
import { Logo } from '@/components/shared/icons';
import { AuthSignOutButton } from '@/components/shared/AuthSignOutButton';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/app/home', label: 'Home', icon: LayoutGrid, className: 'text-sky-500' },
  { href: '/app/my-events', label: 'My Events', icon: FolderKanban, className: 'text-orange-500' },
  { href: '/app/events/new', label: 'New Event', icon: PlusSquare, className: 'text-green-500' },
  { href: '/app/services', label: 'My Services', icon: Briefcase, className: 'text-rose-500' },
  { href: '/app/timeline', label: 'Timeline', icon: ListTree, className: 'text-indigo-500' },
  { href: '/app/designs', label: 'Designs', icon: Palette, className: 'text-purple-500' },
  { href: '/app/gallery', label: 'My Gallery', icon: Camera, className: 'text-pink-500' },
  { href: '/app/payments', label: 'Payments', icon: CreditCard, className: 'text-amber-500' },
  { href: '/app/chat', label: 'Chat', icon: Bot, className: 'text-teal-500' },
  { href: '/app/profile', label: 'My Profile', icon: User, className: 'text-slate-500' },
];

export default function AppPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const { toggleSidebar } = useSidebar();

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
            {NAV_ITEMS.map(({ href, label, icon: Icon, className }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    aria-current={active ? 'page' : undefined}
                    className={cn('justify-start', active && 'bg-primary/10 text-primary hover:bg-primary/15')}
                  >
                    <Link href={href}>
                      <Icon className={className} />
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
                  <Home /> Go to Site
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
        {/* Top bar with hamburger toggle (mobile-first) */}
        <header className="sticky top-0 z-20 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50 border-b">
          <div className="flex items-center gap-2 p-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border md:hidden"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-medium text-sm text-muted-foreground">Your Portal</span>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
