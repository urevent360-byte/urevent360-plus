'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, LogOut, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';

import { useLanguage } from '@/contexts/LanguageProvider';
import { useAuth } from '@/contexts/AuthProvider';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/icons';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useCart } from '@/hooks/use-cart';
import { useOpenInquiryModal } from '../page/home/InquiryModal';


export function Header() {
  const { language } = useLanguage();
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { items } = useCart();
  const { setOpen: setInquiryOpen } = useOpenInquiryModal();

  // Prevent hydration errors by only rendering the cart count on the client
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const navItems = [
    { href: '/', label: translations.nav.home },
    { href: '/services', label: translations.nav.services },
    { href: '/gallery', label: translations.nav.gallery },
    { href: '/contact', label: translations.nav.contact },
  ];

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className={cn(
      "flex items-center gap-4",
      isMobile ? "flex-col space-y-4 pt-8" : "hidden md:flex"
    )}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'font-medium transition-colors hover:text-primary',
            pathname === item.href ? 'text-primary' : 'text-slate-500',
            isMobile && 'text-2xl'
          )}
          onClick={() => setSheetOpen(false)}
        >
          {item.label[language]}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        
        <div className="flex items-center gap-2 text-slate-800">
          <NavLinks />
          <LanguageToggle />

           <Button variant="ghost" size="icon" className="relative" onClick={() => setInquiryOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            {isClient && items.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {items.length}
                </span>
            )}
            <span className="sr-only">Open inquiry cart</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                    <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">{translations.nav.dashboard[language]}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{translations.auth.logout[language]}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">{translations.nav.login[language]}</Link>
            </Button>
          )}

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
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
