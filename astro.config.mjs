import { defineConfig } from 'astro/config';

// ---------------------------------------------------------------
// 部署相关配置（只在部署到 GitHub Pages 时才需要关心）
// ---------------------------------------------------------------
// SITE_URL : 你的站点最终访问地址
//   - 个人主页仓库 (仓库名 = <用户名>.github.io) -> https://<用户名>.github.io
//   - 普通项目仓库   (仓库名 = my-blog)          -> https://<用户名>.github.io
// BASE_PATH: 站点部署在域名根目录还是子路径
//   - 个人主页仓库 -> /
//   - 普通项目仓库 -> /my-blog
// 本地开发时这两个变量为空，默认值即可，不用改。
const SITE_URL = process.env.SITE_URL || 'https://your-name.github.io';
const BASE_PATH = process.env.BASE_PATH || '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'ignore',
  markdown: {
    shikiConfig: {
      // 明暗两套代码高亮，由 CSS 里的 --shiki-light / --shiki-dark 切换
      themes: {
        light: 'github-light-default',
        dark: 'github-dark-default',
      },
      defaultColor: false,
      wrap: true,
    },
  },
  vite: {
    resolve: {
      // 依赖安装为扁平结构时不依赖符号链接，跳过 realpath 解析可避免
      // 某些受限环境下调用子进程失败（Windows 上尤其明显）
      preserveSymlinks: true,
    },
  },
  devToolbar: {
    enabled: false,
  },
});
