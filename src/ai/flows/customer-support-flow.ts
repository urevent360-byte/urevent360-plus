'use server';
/**
 * @fileOverview A customer support AI agent for UREVENT 360 PLUS.
 *
 * - continueConversation - A function that continues a conversation with the AI.
 * - ConversationInput - The input type for the continueConversation function.
 * - ConversationOutput - The return type for the continueConversation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { MessageData } from 'genkit';

const ConversationInputSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.array(z.object({ text: z.string() })),
    })
  ).describe('A history of messages in the conversation.'),
});
export type ConversationInput = z.infer<typeof ConversationInputSchema>;

const ConversationOutputSchema = z.string().describe("The AI's response.");
export type ConversationOutput = z.infer<typeof ConversationOutputSchema>;

export async function continueConversation(messages: MessageData[]): Promise<ConversationOutput> {
  return customerSupportFlow(messages);
}

const prompt = ai.definePrompt({
  name: 'customerSupportPrompt',
  system: `You are a friendly and helpful customer support assistant for UREVENT 360 PLUS, an event planning and entertainment company.

Your goal is to answer customer questions about the services offered, help them with booking inquiries, and provide information about the company. Be conversational and welcoming.

Here are the services offered:
- 360 Photo Booth
- Magic Mirror
- Photo Booth Printer
- La Hora Loca with LED Robot
- Cold Sparklers
- Dance on the Clouds
- Projectors for slideshows and videos
- Custom Monogram Projectors
- LED Screen Walls

Keep your answers concise and encourage users to use the "Request an Inquiry" button to get a price quote or book services. Do not make up services or pricing.`,
  tools: [],
});

const customerSupportFlow = ai.defineFlow(
  {
    name: 'customerSupportFlow',
    inputSchema: z.any(),
    outputSchema: z.string(),
  },
  async (messages) => {
    const { output } = await prompt(messages);
    return output?.text || "I'm sorry, I'm having trouble responding right now. Please try again in a moment.";
  }
);
