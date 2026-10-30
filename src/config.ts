/**
 * 站点的全局配置 —— 改这里就能改掉整站的名字、简介、导航
 */
export const SITE = {
  /** 站点名（显示在页头、浏览器标签页、RSS 里） */
  title: '拾光集',
  /** 一句话简介 */
  description: '记录技术、阅读与生活里那些值得留下的东西。',
  /** 作者署名 */
  author: '你的名字',
  /** 语言 */
  lang: 'zh-CN',
  /** 导航栏 */
  nav: [
    { label: '首页', href: '/' },
    { label: '文章', href: '/blog' },
    { label: '归档', href: '/archive' },
    { label: '关于', href: '/about' },
  ],
  /** 页脚外链：换成你自己的 */
  socials: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'RSS', href: '/rss.xml' },
  ],
};
