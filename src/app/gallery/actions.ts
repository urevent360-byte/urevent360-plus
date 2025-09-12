'use server';

import { dynamicallyArrangeImages } from '@/ai/flows/dynamically-arrange-images-with-ai';
import placeholderImagesData from '@/lib/placeholder-images.json';

type ActionResponse = {
  data?: {
    arrangedImageDataUris: string[];
    layoutMetadata: string;
  };
  error?: string;
};

async function imageUrlToDataUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, { cache: 'force-cache' });
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${blob.type};base64,${base64}`;
  } catch (error) {
    console.error(`Error converting image URL to data URL: ${url}`, error);
    return '';
  }
}

export async function arrangeImagesAction(): Promise<ActionResponse> {
  const galleryImages = placeholderImagesData.placeholderImages.filter(p => p.id.startsWith('gallery-'));
  
  // Using a smaller subset to keep the action fast.
  const imageUrisToConvert = galleryImages.slice(0, 6).map(img => img.imageUrl);

  try {
    const imageDataUris = await Promise.all(imageUrisToConvert.map(imageUrlToDataUrl));
    const validDataUris = imageDataUris.filter(uri => uri !== '');

    if (validDataUris.length < 2) {
      return { error: 'Could not process enough images for arrangement. Please try again later.' };
    }

    const result = await dynamicallyArrangeImages({ imageDataUris: validDataUris });
    
    if (!result || !result.arrangedImageDataUris || result.arrangedImageDataUris.length === 0) {
        return { error: 'The AI could not arrange the images. Please try again.' };
    }

    return { data: result };
  } catch (error) {
    console.error('Error in arrangeImagesAction:', error);
    return { error: 'An unexpected error occurred while communicating with the AI. Please try again later.' };
  }
}
