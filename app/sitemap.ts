import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orrica-edge-resume-builder.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['/', '/templates', '/pricing', '/about'];
  return routes.map((path, index) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: index === 0 ? 1 : 0.7,
  }));
}
