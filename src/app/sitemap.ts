import { MetadataRoute } from 'next';
import servicesCatalog from '@/lib/services-catalog.json';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://urevent360.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ] as MetadataRoute.Sitemap;

  const serviceRoutes = servicesCatalog.services
    .filter(service => service.active)
    .map(service => ({
      url: `${siteUrl}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

  return [...staticRoutes, ...serviceRoutes];
}
