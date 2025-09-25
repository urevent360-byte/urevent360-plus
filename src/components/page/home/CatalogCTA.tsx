
'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function CatalogCTA({ catalogUrl }: { catalogUrl: string }) {
  return (
    <div className="text-center">
      <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
        Explore Our Services
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-lg text-foreground/80">
        Download our complete service catalog to discover everything we have to offer for your next event.
      </p>
      <Button asChild size="lg" className="mt-8 bg-accent font-bold text-accent-foreground hover:bg-accent/90">
        <a href={catalogUrl} download target="_blank">
          <Download className="mr-2" />
          Download Catalog (PDF)
        </a>
      </Button>
    </div>
  );
}
