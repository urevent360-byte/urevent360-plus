'use client';

import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';
import { Logo } from '@/components/shared/icons';
import { useLanguage } from '@/contexts/LanguageProvider';
import { translations } from '@/lib/translations';

export function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <Logo />
            <p className="mt-4 max-w-xs">
              {translations.footer.motto[language]}
            </p>
          </div>
          
          <div>
            <h3 className="font-headline font-semibold uppercase tracking-wider">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center justify-center md:justify-start gap-2 hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
                <a href="mailto:info@urevent360.com">info@urevent360.com</a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 hover:text-primary transition-colors">
                <Phone className="h-5 w-5" />
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline font-semibold uppercase tracking-wider">Follow Us</h3>
            <div className="mt-4 flex justify-center md:justify-start space-x-4">
              <a href="#" className="hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} UREVENT 360 PLUS. {translations.footer.copyright[language]}</p>
        </div>
      </div>
    </footer>
  );
}
