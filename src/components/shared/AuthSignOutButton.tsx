'use client';

import { useAuth } from '@/contexts/AuthProvider';
import { SidebarMenuButton } from '../ui/sidebar';

export function AuthSignOutButton({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const { signOut } = useAuth();
    return <SidebarMenuButton onClick={signOut}>{children}</SidebarMenuButton>;
}
