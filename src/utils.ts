/**
 * 小工具函数
 */

const BASE = import.meta.env.BASE_URL;

/**
 * 给站内链接加上 base 前缀。
 * 部署到 https://<user>.github.io/my-blog/ 这种子路径时也不会 404。
 */
export function withBase(path = '/'): string {
  const base = BASE.replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}` || '/';
}

/** 把日期格式化成「2026 年 10 月 30 日」 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/** 机器可读日期，用于 <time datetime=""> 和 RSS */
export function isoDate(date: Date): string {
  return date.toISOString();
}

/**
 * 估算阅读时长（分钟）。中文按 400 字/分钟，英文按 220 词/分钟。
 */
export function readingTime(body = ''): number {
  const cjk = (body.match(/[\u3400-\u9fff]/g) || []).length;
  const words = (body.replace(/[\u3400-\u9fff]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length;
  return Math.max(1, Math.ceil(cjk / 400 + words / 220));
}
