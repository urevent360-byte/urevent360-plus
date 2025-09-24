
'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const promptSchema = z.object({
  systemPrompt: z.string().min(1, 'System prompt cannot be empty.'),
});

const promptEsSchema = z.object({
  systemPromptEs: z.string().min(1, 'Spanish system prompt cannot be empty.'),
});

const promptFilePath = path.join(process.cwd(), 'src', 'lib', 'ai-system-prompt.txt');
const promptEsFilePath = path.join(process.cwd(), 'src', 'lib', 'ai-system-prompt-es.txt');


export async function getSystemPromptAction(): Promise<{ success: boolean; prompt?: string; message?: string }> {
    try {
        const prompt = await fs.readFile(promptFilePath, 'utf-8');
        return { success: true, prompt };
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { success: true, prompt: '' };
        }
        console.error('Error reading EN prompt file:', error);
        return { success: false, message: 'Failed to read English prompt file.' };
    }
}

export async function updateSystemPromptAction(formData: FormData): Promise<{ success: boolean; message?: string }> {
  const validatedFields = promptSchema.safeParse({
    systemPrompt: formData.get('systemPrompt'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors.systemPrompt?.[0] || 'Invalid data.',
    };
  }
  
  try {
    await fs.writeFile(promptFilePath, validatedFields.data.systemPrompt);
    return { success: true };
  } catch (error) {
    console.error('Error saving EN system prompt:', error);
    return { success: false, message: 'Failed to save the English system prompt.' };
  }
}

export async function getSystemPromptEsAction(): Promise<{ success: boolean; prompt?: string; message?: string }> {
    try {
        const prompt = await fs.readFile(promptEsFilePath, 'utf-8');
        return { success: true, prompt };
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { success: true, prompt: '' };
        }
        console.error('Error reading ES prompt file:', error);
        return { success: false, message: 'Failed to read Spanish prompt file.' };
    }
}

export async function updateSystemPromptEsAction(formData: FormData): Promise<{ success: boolean; message?: string }> {
  const validatedFields = promptEsSchema.safeParse({
    systemPromptEs: formData.get('systemPromptEs'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors.systemPromptEs?.[0] || 'Invalid data.',
    };
  }
  
  try {
    await fs.writeFile(promptEsFilePath, validatedFields.data.systemPromptEs);
    return { success: true };
  } catch (error) {
    console.error('Error saving ES system prompt:', error);
    return { success: false, message: 'Failed to save the Spanish system prompt.' };
  }
}
