
'use server';

import fs from 'fs/promises';
import path from 'path';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
const catalogConfigFile = path.join(process.cwd(), 'public', 'catalog.json');

async function saveFile(file: File): Promise<string> {
    await fs.mkdir(uploadsDir, { recursive: true });
    const filename = `catalog-${Date.now()}${path.extname(file.name)}`;
    const filePath = path.join(uploadsDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);
    return `/uploads/${filename}`;
}

export async function getCatalogAction(): Promise<{ success: boolean; catalogUrl?: string; }> {
    try {
        const data = await fs.readFile(catalogConfigFile, 'utf-8');
        const config = JSON.parse(data);
        return { success: true, ...config };
    } catch (error) {
        // If file doesn't exist, return success with no data
        return { success: true };
    }
}

export async function updateCatalogAction(formData: FormData): Promise<{ success: boolean; message?: string }> {
  try {
    const catalogFile = formData.get('catalog') as File | null;
    let newCatalogUrl = '';

    if (catalogFile) {
        newCatalogUrl = await saveFile(catalogFile);
    } else {
        return { success: false, message: 'No file was provided for upload.'}
    }

    const newCatalogData = {
        catalogUrl: newCatalogUrl,
    };

    await fs.writeFile(catalogConfigFile, JSON.stringify(newCatalogData, null, 2));

    return { success: true };
  } catch (error) {
    console.error('Error updating catalog:', error);
    return { success: false, message: 'Failed to save catalog file.' };
  }
}
