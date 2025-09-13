'use client';

import { useAuth } from '@/contexts/AuthProvider';
import { SidebarMenuButton } from '../ui/sidebar';
import { LogOut } from 'lucide-react';

export function AuthSignOutButton() {
    const { signOut } = useAuth();
    return (
        <SidebarMenuButton onClick={signOut}>
            <LogOut />
            Logout
        </SidebarMenuButton>
    );
}
