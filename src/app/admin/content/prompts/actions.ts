'use server';

import fs from 'fs/promises';
import path from 'path';

const promptFilePath = path.join(
  process.cwd(),
  'src',
  'lib',
  'ai-system-prompt.txt'
);
const promptEsFilePath = path.join(
  process.cwd(),
  'src',
  'lib',
  'ai-system-prompt-es.txt'
);

export async function getSystemPromptAction() {
  try {
    const prompt = await fs.readFile(promptFilePath, 'utf-8');
    return { success: true, prompt };
  } catch (error) {
    return { success: false, message: 'Failed to read English system prompt.' };
  }
}

export async function getSystemPromptEsAction() {
  try {
    const prompt = await fs.readFile(promptEsFilePath, 'utf-8');
    return { success: true, prompt };
  } catch (error) {
    return { success: false, message: 'Failed to read Spanish system prompt.' };
  }
}

export async function updateSystemPromptAction(formData: FormData) {
  try {
    const systemPrompt = formData.get('systemPrompt') as string;
    await fs.writeFile(promptFilePath, systemPrompt);
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to update English system prompt.' };
  }
}

export async function updateSystemPromptEsAction(formData: FormData) {
  try {
    const systemPromptEs = formData.get('systemPromptEs') as string;
    await fs.writeFile(promptEsFilePath, systemPromptEs);
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to update Spanish system prompt.' };
  }
}
