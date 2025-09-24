
'use client';

import React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Instagram } from 'lucide-react';

const placeholderPosts = [
  { id: 1, imageUrl: 'https://picsum.photos/seed/social1/500/500', likes: 120, comments: 5 },
  { id: 2, imageUrl: 'https://picsum.photos/seed/social2/500/500', likes: 345, comments: 12 },
  { id: 3, imageUrl: 'https://picsum.photos/seed/social3/500/500', likes: 210, comments: 8 },
  { id: 4, imageUrl: 'https://picsum.photos/seed/social4/500/500', likes: 580, comments: 25 },
  { id: 5, imageUrl: 'https://picsum.photos/seed/social5/500/500', likes: 432, comments: 18 },
  { id: 6, imageUrl: 'https://picsum.photos/seed/social6/500/500', likes: 199, comments: 7 },
  { id: 7, imageUrl: 'https://picsum.photos/seed/social7/500/500', likes: 640, comments: 30 },
];

export function SocialFeed() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  return (
    <div className="text-center">
      <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl flex items-center justify-center gap-2">
        <Instagram /> Follow Us on Instagram
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-lg text-foreground/80">
        See our latest events and behind-the-scenes moments.
      </p>

      <div className="mt-12">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          opts={{
            align: 'start',
            loop: true,
          }}
        >
          <CarouselContent className="-ml-4">
            {placeholderPosts.map((post) => (
              <CarouselItem key={post.id} className="pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <div className="p-1">
                  <Card className="group overflow-hidden border-0 shadow-lg">
                    <CardContent className="relative p-0">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <div className="relative aspect-square w-full">
                                <Image
                                  src={post.imageUrl}
                                  alt={`Instagram post ${post.id}`}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                                    <div className="flex items-center gap-1">
                                        <p>{post.likes}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <p>{post.comments}</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
