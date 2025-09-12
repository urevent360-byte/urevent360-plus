'use client';

import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';
import { Logo } from '@/components/shared/icons';
import { useLanguage } from '@/contexts/LanguageProvider';
import { translations } from '@/lib/translations';

export function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="bg-white text-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <Logo />
            <p className="mt-4 max-w-xs text-gray-600">
              {translations.footer.motto[language]}
            </p>
          </div>
          
          <div>
            <h3 className="font-headline font-semibold uppercase tracking-wider text-primary">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center justify-center md:justify-start gap-2 text-gray-600 hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
                <a href="mailto:urevent360@gmail.com">urevent360@gmail.com</a>
              </li>
               <li className="flex items-center justify-center md:justify-start gap-2 text-gray-600 hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
                <a href="mailto:info@urevent360.com">info@urevent360.com</a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-gray-600 hover:text-primary transition-colors">
                <Phone className="h-5 w-5" />
                <a href="tel:6893025502">(689) 302-5502</a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-gray-600 hover:text-primary transition-colors">
                <Phone className="h-5 w-5" />
                <a href="tel:4075330970">(407) 533-0970 (Español)</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline font-semibold uppercase tracking-wider text-primary">Follow Us</h3>
            <div className="mt-4 flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-gray-600 hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/urevent360" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} UREVENT 360 PLUS. {translations.footer.copyright[language]}</p>
        </div>
      </div>
    </footer>
  );
}
