import type { MetadataRoute } from 'next';
import { getChapters, getPieces } from '@/lib/content';

export const dynamic = 'force-static';

const BASE = 'https://aaryanpanchal.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const surface = ['', '/work', '/work/episafe', '/builds', '/writing', '/becoming', '/becoming/map', '/about', '/book'];

  return [
    ...surface.map((p) => ({
      url: `${BASE}${p}/`.replace(/\/\/$/, '/'),
      changeFrequency: 'monthly' as const,
      priority: p === '' ? 1 : 0.8,
    })),
    ...getChapters()
      .filter((c) => c.index)
      .map((c) => ({ url: `${BASE}/becoming/${c.slug}/`, changeFrequency: 'monthly' as const, priority: 0.6 })),
    // Only pieces explicitly opted in — raw and angry drafts stay out.
    ...getPieces()
      .filter((p) => p.index)
      .map((p) => ({ url: `${BASE}/writing/${p.slug}/`, changeFrequency: 'yearly' as const, priority: 0.3 })),
  ];
}
