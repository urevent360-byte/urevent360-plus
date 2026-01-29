'use client';

import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';
import { Logo } from '@/components/shared/icons';
import footerData from '@/lib/footer-data.json';

export function Footer() {

  const { contact, social } = footerData;

  return (
    <footer className="bg-white text-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <Logo />
            <p className="mt-4 max-w-xs text-gray-600">
              Crafting unforgettable moments.
            </p>
          </div>
          
          <div>
            <h3 className="font-headline font-semibold uppercase tracking-wider text-primary">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              {(contact as any).emails.map((email: any, index: number) => (
                <li key={index} className="flex items-center justify-center md:justify-start gap-2 text-gray-600 hover:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                  <a href={`mailto:${email.address}`}>{email.address}</a>
                </li>
              ))}
              {(contact as any).phones.map((phone: any, index: number) => (
                 <li key={index} className="flex items-center justify-center md:justify-start gap-2 text-gray-600 hover:text-primary transition-colors">
                    <Phone className="h-5 w-5" />
                    <a href={`tel:${phone.number.replace(/\D/g, '')}`}>
                      {phone.number} {phone.label && `(${phone.label})`}
                    </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-headline font-semibold uppercase tracking-wider text-primary">Follow Us</h3>
            <div className="mt-4 flex justify-center md:justify-start space-x-4">
              {social.facebook && social.facebook !== '#' && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors" aria-label="Facebook">
                  <Facebook className="h-6 w-6" />
                </a>
              )}
              {social.instagram && social.instagram !== '#' && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors" aria-label="Instagram">
                  <Instagram className="h-6 w-6" />
                </a>
              )}
               {social.twitter && social.twitter !== '#' && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors" aria-label="Twitter">
                  <Twitter className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} UREVENT 360 PLUS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
