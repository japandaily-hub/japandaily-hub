import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // 末尾にスラッシュを入れ、リポジトリ名と完全に一致させます
  site: 'https://japandaily-hub.github.io',
  base: '/japandaily-hub',
  integrations: [tailwind()],
  output: 'static',
  build: {
    // フォルダ構造をGitHub Pagesに最適化
    format: 'directory',
  },
});
