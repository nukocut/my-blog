import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../config';
import { withBase } from '../utils';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: SITE.title,
    description: SITE.description,
    // 带上 base 前缀，子路径部署时频道的 <link> 才是 /仓库名/ 而不是站点根
    site: new URL(import.meta.env.BASE_URL, context.site ?? 'https://example.com'),
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: withBase(`/blog/${post.id}/`),
    })),
    customData: `<language>zh-cn</language>`,
  });
}
