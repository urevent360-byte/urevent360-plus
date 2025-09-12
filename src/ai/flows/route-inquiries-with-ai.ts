'use server';
/**
 * @fileOverview This file defines a Genkit flow for routing inquiries to the appropriate sales contact based on language preference and content of the inquiry.
 *
 * - routeInquiry - A function that handles the inquiry routing process.
 * - RouteInquiryInput - The input type for the routeInquiry function.
 * - RouteInquiryOutput - The return type for the routeInquiry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RouteInquiryInputSchema = z.object({
  name: z.string().describe('The name of the person submitting the inquiry.'),
  email: z.string().email().describe('The email address of the person submitting the inquiry.'),
  message: z.string().describe('The content of the inquiry message.'),
  languagePreference: z
    .enum(['en', 'es'])
    .describe('The preferred language of the person submitting the inquiry (en for English, es for Spanish).'),
});
export type RouteInquiryInput = z.infer<typeof RouteInquiryInputSchema>;

const RouteInquiryOutputSchema = z.object({
  salesContact: z.object({
    name: z.string().describe('The name of the sales contact.'),
    email: z.string().email().describe('The email address of the sales contact.'),
    language: z.enum(['en', 'es']).describe('The language spoken by the sales contact (en or es).'),
  }).describe('The sales contact to route the inquiry to.'),
  reason: z.string().describe('The reason why this sales contact was chosen.'),
});
export type RouteInquiryOutput = z.infer<typeof RouteInquiryOutputSchema>;

export async function routeInquiry(input: RouteInquiryInput): Promise<RouteInquiryOutput> {
  return routeInquiryFlow(input);
}

const routeInquiryPrompt = ai.definePrompt({
  name: 'routeInquiryPrompt',
  input: {schema: RouteInquiryInputSchema},
  output: {schema: RouteInquiryOutputSchema},
  prompt: `You are an AI assistant responsible for routing customer inquiries to the appropriate sales contact.

  Based on the following inquiry information, determine the best sales contact to handle the inquiry.

  Inquiry Details:
  Name: {{{name}}}
  Email: {{{email}}}
  Message: {{{message}}}
  Language Preference: {{{languagePreference}}}

  Consider the language preference and the content of the inquiry message when selecting the sales contact.

  Output the sales contact details in the following JSON format:
  {
    "salesContact": {
      "name": "Sales Contact Name",
      "email": "salescontact@example.com",
      "language": "en" or "es"
    },
    "reason": "The reason why this sales contact was chosen."
  }`,
});

const routeInquiryFlow = ai.defineFlow(
  {
    name: 'routeInquiryFlow',
    inputSchema: RouteInquiryInputSchema,
    outputSchema: RouteInquiryOutputSchema,
  },
  async input => {
    const {output} = await routeInquiryPrompt(input);
    return output!;
  }
);
