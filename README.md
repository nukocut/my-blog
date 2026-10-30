# 我的博客

一个用 [Astro](https://astro.build) 搭建的静态个人博客：写 Markdown 就自动生成网站，免费托管在 GitHub Pages 上，不需要服务器、数据库或后台。

## 特点

- 📝 **写作即发布**：`src/content/blog/` 里放一个 `.md` 文件就是一篇文章
- 🚀 **纯静态**：构建产物是纯 HTML/CSS，加载快、零维护、CDN 友好
- 🌗 **明暗主题**：跟随系统，可手动切换，选择会被记住
- 📱 **响应式**：手机、平板、桌面都适配
- 🔍 **SEO 基础**：canonical、Open Graph、RSS、sitemap 都有
- 🎨 **好改**：全站配色集中在 `src/styles/global.css` 开头的变量里

## 快速开始

需要 Node.js 18.17+（推荐 20 或 22）。

```bash
# 1. 安装依赖
npm install          # 或者 pnpm install / yarn

# 2. 启动本地开发服务器
npm run dev          # 打开 http://localhost:4321

# 3. 构建（产物在 dist/）
npm run build

# 4. 本地预览构建结果
npm run preview
```

`npm run dev` 启动后，改任何文件浏览器都会自动刷新。

## 目录结构

```text
my-blog/
├── src/
│   ├── config.ts              ← 站点名、简介、导航、页脚链接（先改这里）
│   ├── content.config.ts      ← 文章字段定义与校验规则
│   ├── content/blog/          ← 你的文章都放这里，一个 .md 一篇
│   ├── components/            ← 页头 / 页脚 / 文章卡片
│   ├── layouts/BaseLayout.astro ← 页面骨架（head、SEO、主题脚本）
│   ├── pages/                 ← 路由，文件名即网址
│   │   ├── index.astro        → /
│   │   ├── blog/index.astro   → /blog
│   │   ├── blog/[...slug].astro → /blog/<文件名>
│   │   ├── archive.astro      → /archive
│   │   ├── about.astro        → /about
│   │   ├── 404.astro          → 404 页
│   │   ├── rss.xml.ts         → /rss.xml
│   │   └── sitemap.xml.ts     → /sitemap.xml
│   ├── styles/global.css      ← 全站样式
│   └── utils.ts               ← 日期格式化、阅读时长、base 路径
├── public/                    ← 原样拷贝的资源（favicon、图片）
├── astro.config.mjs           ← 站点地址、部署路径、代码高亮
└── .github/workflows/deploy.yml ← 推送到 GitHub 后自动部署
```

## 写一篇新文章

在 `src/content/blog/` 下新建文件，比如 `my-first-post.md`，网址就是 `/blog/my-first-post/`。

```markdown
---
title: 文章标题
description: 一句话摘要，会出现在列表、搜索结果和 RSS 里
pubDate: 2026-10-30
tags: ['随笔', '技术']
---

正文从这里开始，正常写 Markdown 就行。
```

### Front matter 字段

| 字段 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `title` | ✅ | string | 文章标题 |
| `pubDate` | ✅ | 日期 | 发布日期，如 `2026-10-30` |
| `description` | | string | 摘要，建议 50–120 字 |
| `updatedDate` | | 日期 | 更新时间，填了会在文章页显示 |
| `tags` | | string[] | 标签数组 |
| `draft` | | boolean | `true` 表示草稿，不会出现在任何列表里 |
| `cover` | | string | 封面图路径（当前未在页面中使用，留作扩展） |

写错字段名或类型会**在构建时直接报错**，这是有意的：宁可在本地失败，也不要把坏页面发到线上。

## 改成你自己的

### 1. 站点信息

编辑 `src/config.ts`：

```ts
export const SITE = {
  title: '拾光集',            // 站点名
  description: '……',          // 一句话简介
  author: '你的名字',          // 页脚署名
  nav: [...],                 // 导航项
  socials: [...],             // 页脚外链
};
```

### 2. 首页大标题

编辑 `src/pages/index.astro` 里的 `.hero` 部分（`写下来，才算真的想过。`那几句）。

### 3. 配色与字体

`src/styles/global.css` 最上面有两组变量：`:root`（浅色）和 `[data-theme='dark']`（深色）。改 `--accent` 就换掉强调色，改 `--content-width` 就改正文栏宽。

### 4. 关于页

编辑 `src/pages/about.astro`，把占位文字换成你的自我介绍。

### 5. 网站图标

替换 `public/favicon.svg`（正方形 SVG 最好，浏览器会自己缩放）。

## 部署到 GitHub Pages（免费）

### 第一步：建仓库并推送

在 GitHub 新建一个仓库，比如叫 `my-blog`，然后把本地代码推上去：

```bash
git init
git add -A
git commit -m "init blog"
git branch -M main
git remote add origin https://github.com/<你的用户名>/my-blog.git
git push -u origin main
```

### 第二步：开启 Pages

打开仓库 → **Settings → Pages** → 在 **Build and deployment** 的 Source 里选 **GitHub Actions**。

推送（或手动运行）后，`.github/workflows/deploy.yml` 会自动构建并发布。第一次大概需要 1–2 分钟。

### 第三步：访问

- 仓库名是 `my-blog` → 网址是 `https://<用户名>.github.io/my-blog/`
- 仓库名是 `<用户名>.github.io` → 网址是 `https://<用户名>.github.io/`

workflow 里已经自动处理了这个区别：

```yaml
BASE_PATH: ${{ endsWith(github.repository, '.github.io') && '/' || format('/{0}', github.event.repository.name) }}
```

**如果站点部署在子路径下**（第一种情况），想手动本地验证：

```bash
BASE_PATH=/my-blog npm run build
```

所有站内链接都经过 `withBase()` 处理，所以两种部署方式都不用改代码。

### 使用自己的域名

1. 在域名服务商处添加一条 CNAME 记录，指向 `<用户名>.github.io`；
2. 仓库 **Settings → Pages → Custom domain** 填入 `blog.example.com`；
3. 在 `public/` 下新建 `CNAME` 文件，内容就是这一行域名（防止每次部署丢失配置）；
4. 勾选 **Enforce HTTPS**。

同时把 workflow 里的 `SITE_URL` 改成你的域名，这样 RSS、canonical 里的链接才正确。

## 常见问题

**Q：页面能打开但样式全丢了？**
大概率是 `base` 配错了。项目仓库一定带 `/仓库名` 前缀，`<用户名>.github.io` 仓库则用 `/`。

**Q：改了文章，线上没更新？**
去仓库的 **Actions** 标签页看构建是否成功。失败通常是因为 front matter 少了必填字段。

**Q：能加评论吗？**
可以，用 [Giscus](https://giscus.app)（基于 GitHub Discussions，免费无后端）：在文章页底部嵌一段 script 即可。

**Q：能加图片吗？**
放在 `public/images/` 下，Markdown 里写 `![说明](/images/x.jpg)`。若部署在子路径下，写 `![说明](../../images/x.jpg)` 之类的相对路径更稳妥。

**Q：想升级 Astro？**
```bash
npm install astro@latest
npm run build
```
大版本升级可能有破坏性变更（尤其是内容集合 API），升级后先本地构建通过再推。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地开发（热更新） |
| `npm run build` | 构建到 `dist/` |
| `npm run preview` | 预览构建结果（`astro preview`） |

## 许可

文章内容归作者所有；代码部分随意取用。
