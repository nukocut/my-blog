import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { withBase } from '../utils';

const STATIC_PAGES = ['/', '/blog', '/archive', '/about'];

export async function GET(context: APIContext) {
  const site = context.site ?? 'https://example.com';
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  const entries = [
    ...STATIC_PAGES.map((path) => ({
      loc: new URL(withBase(path), site).href,
      lastmod: new Date().toISOString().split('T')[0],
    })),
    ...posts.map((post) => ({
      loc: new URL(withBase(`/blog/${post.id}/`), site).href,
      lastmod: post.data.updatedDate?.toISOString().split('T')[0]
        ?? post.data.pubDate.toISOString().split('T')[0],
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
