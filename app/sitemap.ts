import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orrica-edge-resume-builder.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['/', '/jobs', '/templates', '/pricing', '/about'];
  return routes.map((path, index) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/' || path === '/jobs' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path === '/jobs' ? 0.9 : 0.7,
  }));
}
