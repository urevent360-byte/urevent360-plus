'use server';

/**
 * @fileOverview Dynamically arranges images in a gallery using AI to create a visually appealing and contextually relevant presentation.
 *
 * - dynamicallyArrangeImages - A function that takes image data URIs and arranges them dynamically.
 * - DynamicallyArrangeImagesInput - The input type for the dynamicallyArrangeImages function, an array of image data URIs.
 * - DynamicallyArrangeImagesOutput - The return type for the dynamicallyArrangeImages function, an object containing the arranged image data URIs and layout metadata.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const DynamicallyArrangeImagesInputSchema = z.object({
  imageDataUris: z
    .array(z.string())
    .describe(
      'An array of image data URIs that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type DynamicallyArrangeImagesInput = z.infer<
  typeof DynamicallyArrangeImagesInputSchema
>;

const DynamicallyArrangeImagesOutputSchema = z.object({
  arrangedImageDataUris: z
    .array(z.string())
    .describe(
      'An array of image data URIs, arranged for optimal visual appeal and contextual relevance.'
    ),
  layoutMetadata: z
    .string()
    .describe(
      'Metadata describing the layout and arrangement of the images, including any AI-driven decisions.'
    ),
});
export type DynamicallyArrangeImagesOutput = z.infer<
  typeof DynamicallyArrangeImagesOutputSchema
>;

export async function dynamicallyArrangeImages(
  input: DynamicallyArrangeImagesInput
): Promise<DynamicallyArrangeImagesOutput> {
  return dynamicallyArrangeImagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dynamicallyArrangeImagesPrompt',
  input: {schema: DynamicallyArrangeImagesInputSchema},
  output: {schema: DynamicallyArrangeImagesOutputSchema},
  prompt: `You are a creative director specializing in arranging image galleries for maximum visual impact and user engagement.

  Given the following set of images, analyze their content and propose an arrangement that enhances the overall aesthetic and tells a compelling story about UREVENT 360 PLUS\'s offerings.

  Consider factors such as color palettes, subject matter, and visual flow to create a dynamic and attractive presentation.

  The output should contain the arranged image data URIs and layout metadata that includes an explanation of the choices made.

  Images:
  {{#each imageDataUris}}
  - {{media url=this}}
  {{/each}}`,
});

const dynamicallyArrangeImagesFlow = ai.defineFlow(
  {
    name: 'dynamicallyArrangeImagesFlow',
    inputSchema: DynamicallyArrangeImagesInputSchema,
    outputSchema: DynamicallyArrangeImagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
