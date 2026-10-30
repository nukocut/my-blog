---
title: 这个博客是怎么搭起来的
description: 从零到上线的完整记录：Astro 静态站点、内容集合、明暗主题、GitHub Pages 自动部署，以及每一步为什么这么做。
pubDate: 2026-10-30
tags: ['Astro', '建站']
---

这篇文章记录这个站点的技术选型和搭建过程，方便以后自己回头查，也顺手给想看的人一份参考。

## 为什么是静态站点

个人博客只有我一个人写，不需要评论、不需要登录、不需要后台。这意味着：

- **没有数据库**，也就没有备份、迁移、注入攻击的问题；
- **没有服务器**，不需要租 VPS、不用管系统更新、不用付月费；
- **页面是预先生成的 HTML**，加载快，CDN 缓存天然友好。

代价是没有动态能力。但我确实不需要——想要互动，邮件和 GitHub issue 都够用。

## 为什么是 Astro

对比过三个方向：

| 方案 | 优点 | 我的顾虑 |
| --- | --- | --- |
| Hugo | 构建快、单文件二进制 | 模板语法偏另类，改样式要学 Go template |
| Hexo | 中文资料多、主题多 | 生态偏老，构建慢，主题改起来一层套一层 |
| **Astro** | 组件化、默认零 JS、Markdown 原生支持 | 需要 Node 环境 |

最后选 Astro，主要是因为**它写页面用的是 HTML + 一点点 JSX 语法**，改样式时不需要在模板语言和 CSS 之间来回翻译。默认不输出任何 JavaScript，页面干净。

## 项目结构

```text
my-blog/
├── src/
│   ├── content/
│   │   └── blog/           ← 你的文章，一个 .md 文件一篇
│   ├── content.config.ts   ← 文章的字段定义（标题、日期、标签…）
│   ├── config.ts           ← 站点名、导航、页脚链接
│   ├── components/         ← 页头、页脚、文章卡片
│   ├── layouts/            ← 页面骨架
│   ├── pages/              ← 路由：/、/blog、/about …
│   └── styles/global.css   ← 全站样式（改配色只改第一段变量）
├── public/                 ← 图片、favicon 等原样拷贝的资源
└── astro.config.mjs        ← 站点地址、base 路径
```

## 一篇文章的生命周期

1. 在 `src/content/blog/` 新建 `my-post.md`；
2. 顶部写 front matter：

```yaml
---
title: 文章标题
description: 一句话摘要，会显示在列表和搜索结果里
pubDate: 2026-10-30
tags: ['标签一', '标签二']
---
```

3. 下面正常写 Markdown；
4. 保存，本地开发服务器会立刻热更新；
5. 推到 GitHub，自动构建发布。

**文件名就是网址**：`my-post.md` → `/blog/my-post/`。

## 明暗主题是怎么做的

没有引框架，只有一段 10 行的脚本和两组 CSS 变量：

```js
// 页面渲染前先定好主题，避免闪白
const stored = localStorage.getItem('theme');
const dark = matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.dataset.theme = stored || (dark ? 'dark' : 'light');
```

CSS 里只写 `[data-theme='dark'] { --bg: #131110; ... }`，其余样式全部通过变量取值，所以换配色只需要改那十几个变量。

代码高亮也跟着主题走：`astro.config.mjs` 里给 Shiki 配了 `github-light-default` 和 `github-dark-default` 两套 token 配色，渲染出的 `--shiki-light` / `--shiki-dark` 变量再由 CSS 按当前主题取用。

## 部署到 GitHub Pages

`.github/workflows/deploy.yml` 里做了三件事：装依赖 → 构建 → 把 `dist/` 发布出去。

有一个细节值得记一下：**项目仓库的网址带子路径**（`https://用户名.github.io/仓库名/`），所以构建时要告诉 Astro 这个前缀：

```bash
BASE_PATH=/my-blog npm run build
```

代码里所有站内链接都过一层 `withBase()` 函数加前缀，这样本地开发（无前缀）和线上（有前缀）都能正常工作。

## 如果重来一次

大概还是会这么选。唯一会改的是：**先写三篇文章再折腾主题**——样式是很容易上瘾的拖延方式。
