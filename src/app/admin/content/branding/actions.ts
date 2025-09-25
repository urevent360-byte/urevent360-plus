
'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
const brandingConfigFile = path.join(process.cwd(), 'public', 'branding.json');

async function saveFile(file: File): Promise<string> {
    await fs.mkdir(uploadsDir, { recursive: true });
    const fileExtension = path.extname(file.name);
    const filename = `${Date.now()}${fileExtension}`;
    const filePath = path.join(uploadsDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);
    return `/uploads/${filename}`;
}

export async function getBrandingAction(): Promise<{ success: boolean; logoUrl?: string; heroImageUrl?: string; }> {
    try {
        const data = await fs.readFile(brandingConfigFile, 'utf-8');
        const branding = JSON.parse(data);
        return { success: true, ...branding };
    } catch (error) {
        // If file doesn't exist, return success with no data
        return { success: true };
    }
}

export async function updateBrandingAction(formData: FormData): Promise<{ success: boolean; message?: string }> {
  try {
    let currentBranding: { logoUrl?: string; heroImageUrl?: string } = {};
    try {
        const data = await fs.readFile(brandingConfigFile, 'utf-8');
        currentBranding = JSON.parse(data);
    } catch (error) {
        // File doesn't exist, we'll create it
    }

    const logoFile = formData.get('logo') as File | null;
    const heroImageFile = formData.get('heroImage') as File | null;

    let newLogoUrl = currentBranding.logoUrl;
    let newHeroImageUrl = currentBranding.heroImageUrl;

    if (logoFile) {
        newLogoUrl = await saveFile(logoFile);
    }
    if (heroImageFile) {
        newHeroImageUrl = await saveFile(heroImageFile);
    }

    const newBrandingData = {
        logoUrl: newLogoUrl,
        heroImageUrl: newHeroImageUrl
    };

    await fs.writeFile(brandingConfigFile, JSON.stringify(newBrandingData, null, 2));

    return { success: true };
  } catch (error) {
    console.error('Error updating branding:', error);
    return { success: false, message: 'Failed to save branding content.' };
  }
}
