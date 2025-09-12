'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import placeholderImagesData from '@/lib/placeholder-images.json';
import { useLanguage } from '@/contexts/LanguageProvider';
import { translations } from '@/lib/translations';
import { arrangeImagesAction } from './actions';

type ArrangedData = {
  arrangedImageDataUris: string[];
  layoutMetadata: string;
};

const galleryImages = placeholderImagesData.placeholderImages.filter(p => p.id.startsWith('gallery-'));

export default function GalleryPage() {
  const { language } = useLanguage();
  const [arrangedData, setArrangedData] = useState<ArrangedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleArrangeClick = () => {
    startTransition(async () => {
      setError(null);
      setArrangedData(null);
      const result = await arrangeImagesAction();
      if (result.error) {
        setError(result.error);
      } else {
        setArrangedData(result.data || null);
      }
    });
  };

  const GalleryGrid = ({ images, isDataUri = false }: { images: (typeof galleryImages[0] | string)[], isDataUri?: boolean }) => (
    <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
      {images.map((img, index) => (
        <div key={index} className="overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-700 hover:scale-105 hover:shadow-2xl">
          <Image
            src={isDataUri ? (img as string) : (img as typeof galleryImages[0]).imageUrl}
            alt={isDataUri ? `Arranged image ${index + 1}` : (img as typeof galleryImages[0]).description}
            width={400}
            height={600}
            className="w-full h-auto"
            data-ai-hint={isDataUri ? undefined : (img as typeof galleryImages[0]).imageHint}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
          {translations.galleryPage.title[language]}
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          {translations.galleryPage.description[language]}
        </p>
        <Button onClick={handleArrangeClick} disabled={isPending} size="lg" className="mt-8 bg-accent hover:bg-accent/90">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {translations.galleryPage.arrangingButton[language]}
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              {translations.galleryPage.arrangeButton[language]}
            </>
          )}
        </Button>
      </div>

      <div className="mt-16">
        {isPending && (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-semibold">{translations.galleryPage.arrangingButton[language]}</p>
            <p className="text-muted-foreground">The AI is working its magic...</p>
          </div>
        )}

        {error && (
          <Card className="bg-destructive/10 border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">An Error Occurred</CardTitle>
              <CardDescription className="text-destructive/80">{error}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {arrangedData ? (
          <section>
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary text-center my-8">
              {translations.galleryPage.aiLayoutTitle[language]}
            </h2>
            <GalleryGrid images={arrangedData.arrangedImageDataUris} isDataUri />
            <Card className="mt-12 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Layout Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">{arrangedData.layoutMetadata}</p>
              </CardContent>
            </Card>
          </section>
        ) : (
          !isPending && <section className="mt-12"><GalleryGrid images={galleryImages} /></section>
        )}
      </div>
    </div>
  );
}
