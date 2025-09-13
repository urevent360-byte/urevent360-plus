
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  dynamicallyArrangeImages,
  type DynamicallyArrangeImagesOutput,
} from '@/ai/flows/dynamically-arrange-images-with-ai';
import placeholderImages from '@/lib/placeholder-images.json';
import { Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const galleryImages = placeholderImages.placeholderImages.filter(p =>
  p.id.startsWith('gallery-')
);

export default function GalleryPage() {
  const [arrangedData, setArrangedData] =
    useState<DynamicallyArrangeImagesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleArrangeClick = async () => {
    setIsLoading(true);
    setArrangedData(null);
    try {
      const imageDataUris = await Promise.all(
        galleryImages.map(async img => {
          const response = await fetch(img.imageUrl);
          const blob = await response.blob();
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        })
      );

      const result = await dynamicallyArrangeImages({ imageDataUris });
      setArrangedData(result);
    } catch (error) {
      console.error('Error arranging images with AI:', error);
      // Handle error display to the user
    } finally {
      setIsLoading(false);
    }
  };

  const imagesToDisplay = arrangedData
    ? arrangedData.arrangedImageDataUris
    : galleryImages.map(img => img.imageUrl);

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
          Dynamic Image Gallery
        </h1>
        <p className="mx-auto mt-2 max-w-3xl text-lg text-foreground/80">
          Explore our past events. Click the button below to see our AI dynamically rearrange the gallery for a unique visual experience.
        </p>
      </div>

      <div className="text-center">
        <Button onClick={handleArrangeClick} disabled={isLoading} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Arranging...
            </>
          ) : (
            'Arrange with AI'
          )}
        </Button>
      </div>

      {arrangedData && (
        <Alert className="my-8 max-w-4xl mx-auto">
          <AlertTitle className="font-bold">AI-Generated Layout</AlertTitle>
          <AlertDescription>
            {arrangedData.layoutMetadata}
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-12 columns-2 gap-4 sm:columns-3 md:columns-4">
        {imagesToDisplay.map((src, index) => (
          <div key={index} className="relative mb-4 break-inside-avoid">
            <Image
              src={src}
              alt={`Gallery image ${index + 1}`}
              width={500}
              height={700}
              className="h-auto w-full rounded-lg object-cover shadow-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
