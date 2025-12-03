
'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import servicesCatalog from '@/lib/services-catalog.json';
import { useTranslation } from '@/hooks/useTranslation';

const activeServices = servicesCatalog.services.filter(service => service.active);
const allCategories = [...new Set(activeServices.map(service => service.category))];

export default function ServicesPage() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { t } = useTranslation();

  const handleAddToCart = (service: typeof activeServices[0]) => {
    addToCart({
      slug: service.id,
      name: service.title,
      image: service.heroImage || '',
    });
    toast({
      title: t('services.toast.added.title'),
      description: `${t(`service.${service.id}.title`)} ${t('services.toast.added.description')}`,
    });
  };

  const filteredServices = selectedCategory === 'all'
    ? activeServices
    : activeServices.filter(service => service.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
          {t('services.title')}
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          {t('services.subtitle')}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
        >
          {t('services.category.all')}
        </Button>
        {allCategories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {t(`services.category.${category}`)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((service) => (
          <Card key={service.id} className="group overflow-hidden border-0 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2">
             <div className="bg-white">
              <Link href={`/services/${service.slug}`} className="block">
                <div className="relative h-64 w-full">
                  <Image
                    src={service.heroImage || 'https://picsum.photos/800/600'}
                    alt={t(`service.${service.id}.title`)}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </Link>
              <div className="p-6">
                <h3 className="font-headline text-xl font-semibold text-primary">{t(`service.${service.id}.title`)}</h3>
                <p className="mt-2 text-gray-700 min-h-[72px]">{t(`service.${service.id}.desc`)}</p>
                <div className="mt-4 flex gap-2">
                    <Button asChild className="flex-1" variant="outline">
                        <Link href={`/services/${service.slug}`}>
                            {t('services.card.viewDetails')} <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                    <Button onClick={() => handleAddToCart(service)} className="flex-1">
                        <ShoppingCart className="mr-2"/>
                        {t('services.card.addToCart')}
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
