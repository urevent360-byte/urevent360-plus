'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageProvider';
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
import { useState } from 'react';

export function Header() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const navItems = [
    { href: '/', label: translations.nav.home },
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
            pathname === item.href ? 'text-primary' : 'text-foreground/60',
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        
        <div className="flex items-center gap-4">
          <NavLinks />
          <LanguageToggle />

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
