
'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const promptSchema = z.object({
  systemPrompt: z.string().min(1, 'System prompt cannot be empty.'),
});

const promptFilePath = path.join(process.cwd(), 'src', 'lib', 'ai-system-prompt.txt');

export async function getSystemPromptAction(): Promise<{ success: boolean; prompt?: string; message?: string }> {
    try {
        const prompt = await fs.readFile(promptFilePath, 'utf-8');
        return { success: true, prompt };
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            // File doesn't exist, this is not an error, we'll use the default.
            return { success: true, prompt: '' };
        }
        console.error('Error reading prompt file:', error);
        return { success: false, message: 'Failed to read prompt file.' };
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
    console.error('Error saving system prompt:', error);
    return { success: false, message: 'Failed to save the system prompt.' };
  }
}
