
'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import servicesCatalog from '@/lib/services-catalog.json';

const catalogPath = path.join(process.cwd(), 'src', 'lib', 'services-catalog.json');

const serviceSchema = z.object({
  id: z.string().min(2, 'ID is required and must be unique.'),
  slug: z.string().min(2, 'Slug is required.'),
  title: z.string().min(2, 'Service title is required.'),
  category: z.string().min(1, 'Category is required.'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters.'),
  longDescription: z.string().optional(),
  heroImage: z.string().url('A valid hero image URL is required.'),
  galleryImages: z.array(z.string().url()).optional(),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string()).min(1, 'At least one keyword is required.'),
  qualifiers: z.array(z.string()).min(1, 'At least one qualifier question is required.'),
  packageCode: z.string().optional(),
  qbItem: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Service = z.infer<typeof serviceSchema>;

export async function getServicesAction(): Promise<{ success: boolean; services?: Service[]; message?: string }> {
  try {
    const data = await fs.readFile(catalogPath, 'utf-8');
    const catalog = JSON.parse(data);
    return { success: true, services: catalog.services };
  } catch (error) {
    console.error('Error reading services catalog:', error);
    return { success: false, message: 'Failed to load services.' };
  }
}

export async function getServiceAction(id: string): Promise<{ success: boolean; service?: Service; message?: string }> {
  try {
    const data = await fs.readFile(catalogPath, 'utf-8');
    const catalog = JSON.parse(data);
    const service = catalog.services.find((s: Service) => s.id === id);
    if (service) {
      return { success: true, service };
    }
    return { success: false, message: 'Service not found.' };
  } catch (error) {
    console.error('Error reading service:', error);
    return { success: false, message: 'Failed to load service.' };
  }
}

export async function upsertServiceAction(data: Service, isEditing: boolean): Promise<{ success: boolean; message?: string }> {
  const validatedFields = serviceSchema.safeParse({
    ...data,
    slug: data.id, // Ensure slug is always same as id
  });

  if (!validatedFields.success) {
    console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: 'Invalid form data.',
    };
  }

  try {
    const currentCatalogData = await fs.readFile(catalogPath, 'utf-8');
    const currentCatalog = JSON.parse(currentCatalogData);
    const services = currentCatalog.services as Service[];
    const existingIndex = services.findIndex(s => s.id === validatedFields.data.id);
    
    const now = new Date().toISOString();

    if (isEditing) {
      if (existingIndex !== -1) {
        services[existingIndex] = {
            ...validatedFields.data,
            updatedAt: now,
        };
      } else {
        return { success: false, message: 'Service to update not found.' };
      }
    } else {
      if (existingIndex !== -1) {
        return { success: false, message: 'A service with this ID already exists.' };
      }
      services.push({
          ...validatedFields.data,
          createdAt: now,
          updatedAt: now,
      });
    }
    
    currentCatalog.services = services;
    await fs.writeFile(catalogPath, JSON.stringify(currentCatalog, null, 2));

    return { success: true };
  } catch (error) {
    console.error('Error saving service:', error);
    return { success: false, message: 'Failed to save service.' };
  }
}

export async function deleteServiceAction(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const currentCatalogData = await fs.readFile(catalogPath, 'utf-8');
    const currentCatalog = JSON.parse(currentCatalogData);
    const services = (currentCatalog.services as Service[]).filter(s => s.id !== id);
    
    currentCatalog.services = services;
    await fs.writeFile(catalogPath, JSON.stringify(currentCatalog, null, 2));

    return { success: true };
  } catch (error) {
    console.error('Error deleting service:', error);
    return { success: false, message: 'Failed to delete service.' };
  }
}
