import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The after-hours rooms and the raw archive pages are linked, not
        // indexed. Individual writing entries carry their own noindex.
        disallow: ['/play.html', '/void.html', '/crm.html'],
      },
    ],
    sitemap: 'https://aaryanpanchal.com/sitemap.xml',
  };
}
