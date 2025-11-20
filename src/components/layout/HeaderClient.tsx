'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, LogOut, ShoppingCart, User } from 'lucide-react';
import { useState, useEffect } from 'react';

import { useAuth } from '@/contexts/AuthProvider';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/icons';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useCart } from '@/hooks/use-cart';
import { useOpenInquiryModal } from '../page/home/InquiryModal';

export function HeaderClient({ logoUrl }: { logoUrl: string | null }) {
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();
  const rawPathname = usePathname();
  const pathname = rawPathname ?? '';
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { items } = useCart();
  const { setOpen: setInquiryOpen } = useOpenInquiryModal();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const isLoggedIn = !!user;
  const dashboardLink = isAdmin ? '/admin/dashboard' : '/app/dashboard';

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav
      className={cn(
        'flex items-center gap-2',
        isMobile ? 'flex-col space-y-4 pt-8' : 'hidden md:flex'
      )}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'rounded-md px-3 py-1.5 font-medium transition-colors',
            pathname === item.href
              ? 'bg-primary/10 text-primary'
              : 'text-foreground/80 hover:bg-primary/10 hover:text-primary',
            isMobile && 'text-2xl'
          )}
          onClick={() => setSheetOpen(false)}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  const showAuthButtons = isClient && !authLoading;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo logoUrl={logoUrl} />
        </Link>

        <div className="flex items-center gap-2">
          {/* Main links (desktop) */}
          <div className="hidden md:flex">
            <NavLinks />
          </div>

          {/* Inquiry Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setInquiryOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {isClient && items.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {items.length}
              </span>
            )}
            <span className="sr-only">Open inquiry cart</span>
          </Button>

          {/* Auth (desktop) */}
          {showAuthButtons && (
            isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.photoURL || undefined}
                        alt={user?.displayName || 'User'}
                      />
                      <AvatarFallback>
                        {(user?.displayName?.charAt(0) ||
                          user?.email?.charAt(0) ||
                          'U'
                        ).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.displayName || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardLink}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button asChild variant="link" size="sm">
                  <Link href="/app/login">Host Login</Link>
                </Button>
                <Button asChild variant="link" size="sm">
                  <Link href="/admin/login">Admin Login</Link>
                </Button>
              </div>
            )
          )}

          {/* Mobile Drawer */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col items-center justify-center h-full">
                  <NavLinks isMobile />
                  <div className="mt-8 flex flex-col gap-4 w-full px-8">
                    {isLoggedIn ? (
                      <>
                        <Button asChild variant="default" size="lg">
                          <Link
                            href={dashboardLink}
                            onClick={() => setSheetOpen(false)}
                          >
                            Go to Dashboard
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="lg"
                          onClick={() => {
                            setSheetOpen(false);
                            signOut();
                          }}
                        >
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button asChild variant="outline" size="lg">
                          <Link
                            href="/app/login"
                            onClick={() => setSheetOpen(false)}
                          >
                            Host Login
                          </Link>
                        </Button>
                        <Button asChild variant="default" size="lg">
                          <Link
                            href="/admin/login"
                            onClick={() => setSheetOpen(false)}
                          >
                            Admin Login
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
