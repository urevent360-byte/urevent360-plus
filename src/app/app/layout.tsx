
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
import { LayoutGrid, Briefcase, Camera, ListTree, CreditCard, User, LogOut, MessageSquare, Home, Bot } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/shared/icons';
import { AuthSignOutButton } from '@/components/shared/AuthSignOutButton';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
                <Link href="/app/home">
                  <LayoutGrid />
                  Home
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/app/services">
                  <Briefcase />
                  My Services
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/app/inquiries">
                  <MessageSquare />
                  Inquiries
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/app/timeline">
                  <ListTree />
                  Timeline
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/app/gallery">
                  <Camera />
                  My Gallery
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/app/payments">
                  <CreditCard />
                  Payments
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/app/chat">
                  <Bot />
                  Chat
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/app/profile">
                  <User />
                  My Profile
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
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
                    <AuthSignOutButton>
                        <LogOut />
                        Logout
                    </AuthSignOutButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
