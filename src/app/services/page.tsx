'use client';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';

const placeholderServices = [
    { 
        slug: '360-photo-booth',
        name: '360 Photo Booth',
        shortDescription: 'A modern platform where guests can record dynamic, slow-motion videos with a rotating camera.',
        image: 'https://picsum.photos/seed/service1/800/600',
        imageHint: 'quinceañera party 360 photo booth'
    },
    { 
        slug: 'photo-booth-printer',
        name: 'Photo Booth Printer',
        shortDescription: 'Receive glossy, high-quality photo strips instantly with custom logos and designs.',
        image: 'https://picsum.photos/seed/service2/800/600',
        imageHint: 'wedding guests photo strips'
    },
    {
        slug: 'magic-mirror',
        name: 'Magic Mirror',
        shortDescription: 'An interactive, full-length mirror that takes amazing selfies with fun animations.',
        image: 'https://picsum.photos/seed/service3/800/600',
        imageHint: 'elegant event magic mirror'
    },
    { 
        slug: 'la-hora-loca-led-robot',
        name: 'La Hora Loca with LED Robot',
        shortDescription: 'An epic hour of high-energy entertainment with a giant LED robot, dancers, and CO2 jets.',
        image: 'https://picsum.photos/seed/service4/800/600',
        imageHint: 'party LED robot dance'
    },
    { 
        slug: 'cold-sparklers',
        name: 'Cold Sparklers',
        shortDescription: 'Create a stunning, safe pyrotechnic-like effect for magical moments without heat or smoke.',
        image: 'https://picsum.photos/seed/service5/800/600',
        imageHint: 'wedding dance cold sparklers'
    },
    { 
        slug: 'dance-on-the-clouds',
        name: 'Dance on the Clouds',
        shortDescription: 'A dreamy, thick cloud effect that covers the dance floor for a fairy-tale first dance.',
        image: 'https://picsum.photos/seed/service6/800/600',
        imageHint: 'wedding dance clouds'
    },
    { 
        slug: 'projector-slideshows-videos',
        name: 'Projector (Slideshows & Videos)',
        shortDescription: 'Display slideshows and videos on a large screen for an emotional and personal touch.',
        image: 'https://picsum.photos/seed/service7/800/600',
        imageHint: 'wedding reception slideshow'
    },
    { 
        slug: 'monogram-projector',
        name: 'Monogram Projector',
        shortDescription: 'Project a custom, glowing monogram of initials or designs onto the dance floor or wall.',
        image: 'https://picsum.photos/seed/service8/800/600',
        imageHint: 'wedding monogram projection'
    },
    { 
        slug: 'led-screens-wall',
        name: 'LED Screens Wall',
        shortDescription: 'A massive LED screen wall for vibrant visuals, animations, and a futuristic event look.',
        image: 'https://picsum.photos/seed/service9/800/600',
        imageHint: 'wedding stage LED screen'
    }
];

export default function ServicesPage() {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (service: typeof placeholderServices[0]) => {
    addToCart({
      slug: service.slug,
      name: service.name,
      image: service.image,
    });
    toast({
      title: 'Added to cart!',
      description: `${service.name} has been added to your inquiry cart.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
          Our Services
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          Explore the wide range of services we offer to make your event unforgettable.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {placeholderServices.map((service) => (
          <Card key={service.slug} className="group overflow-hidden border-0 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2">
             <div className="bg-white">
              <Link href={`/services/${service.slug}`} className="block">
                <div className="relative h-64 w-full">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    data-ai-hint={service.imageHint}
                  />
                </div>
              </Link>
              <div className="p-6">
                <h3 className="font-headline text-xl font-semibold text-primary">{service.name}</h3>
                <p className="mt-2 text-gray-700 min-h-[72px]">{service.shortDescription}</p>
                <div className="mt-4 flex gap-2">
                    <Button asChild className="flex-1" variant="outline">
                        <Link href={`/services/${service.slug}`}>
                            View Details <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                    <Button onClick={() => handleAddToCart(service)} className="flex-1">
                        <ShoppingCart className="mr-2"/>
                        Add to Cart
                    </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
