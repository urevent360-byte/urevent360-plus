'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageProvider';
import { Download, DownloadCloud, Eye, Image as ImageIcon } from 'lucide-react';
import placeholderImagesData from '@/lib/placeholder-images.json';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';


// We'll use the gallery images as placeholders for event photos
const eventPhotos = placeholderImagesData.placeholderImages.filter(p => p.id.startsWith('gallery-'));
const photoBoothLink = 'https://photos.app.goo.gl/sample1'; // Placeholder link

export default function GalleryPage() {
    const { language } = useLanguage();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const t = {
        title: { en: 'My Event Gallery', es: 'Galería de mi Evento' },
        description: { en: 'View and download photos from your event. This gallery is available for 30 days.', es: 'Visualiza y descarga las fotos de tu evento. Esta galería está disponible por 30 días.' },
        eventName: { en: 'Wedding of John & Jane - August 25, 2024', es: 'Boda de John & Jane - 25 de Agosto, 2024' },
        communityUploads: { en: 'Community Uploads', es: 'Fotos de Invitados' },
        photoBoothAlbum: { en: 'Photo Booth Album', es: 'Álbum de Photo Booth' },
        photoBoothDesc: { en: 'Photos taken at our Photo Booth station.', es: 'Fotos tomadas en nuestra estación de Photo Booth.' },
        viewAlbum: { en: 'View Album', es: 'Ver Álbum' },
        downloadAll: { en: 'Download All (ZIP)', es: 'Descargar Todo (ZIP)' },
        download: { en: 'Download', es: 'Descargar' },
        view: { en: 'View', es: 'Ver' },
        photos: { en: 'photos', es: 'fotos' },
    };
    
    const handleDownloadAll = () => {
        // In a real app, this would trigger a backend process (e.g., a Cloud Function)
        // to create a ZIP file of all images and provide a download link.
        alert('Download All functionality would be implemented in the backend.');
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t.title[language]}</h1>
                    <p className="text-muted-foreground">{t.description[language]}</p>
                </div>
            </div>
            
            {photoBoothLink && (
              <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                  <CardHeader>
                    <div className='flex items-center gap-4'>
                      <ImageIcon className="w-8 h-8 text-primary"/>
                      <div>
                        <CardTitle>{t.photoBoothAlbum[language]}</CardTitle>
                        <CardDescription>{t.photoBoothDesc[language]}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                      <Button asChild>
                          <Link href={photoBoothLink} target="_blank">
                              {t.viewAlbum[language]}
                          </Link>
                      </Button>
                  </CardContent>
              </Card>
            )}

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t.communityUploads[language]}</CardTitle>
                        <CardDescription>{eventPhotos.length} {t.photos[language]}</CardDescription>
                    </div>
                    <Button onClick={handleDownloadAll} variant="outline">
                        <DownloadCloud className="mr-2" />
                        {t.downloadAll[language]}
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {eventPhotos.map((photo) => (
                            <div key={photo.id} className="relative group overflow-hidden rounded-lg shadow-md aspect-square">
                                <Image
                                    src={photo.imageUrl}
                                    alt={photo.description}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setSelectedImage(photo.imageUrl)}>
                                            <Eye className="h-4 w-4" />
                                             <span className="sr-only">View</span>
                                        </Button>
                                        <a href={photo.imageUrl} download={`event-photo-${photo.id}.jpg`}>
                                            <Button variant="secondary" size="icon" className="h-9 w-9">
                                                <Download className="h-4 w-4" />
                                                <span className="sr-only">Download</span>
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
                <DialogContent className="max-w-4xl h-auto">
                    <DialogHeader>
                        <DialogTitle>Photo Preview</DialogTitle>
                    </DialogHeader>
                    {selectedImage && (
                        <div className="relative aspect-video mt-4">
                           <Image
                                src={selectedImage}
                                alt="Enlarged event photo"
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
