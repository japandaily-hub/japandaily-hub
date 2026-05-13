import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // あなたのGitHubユーザー名が japandaily-hub である場合の正確な設定
  site: 'https://japandaily-hub.github.io',
  base: '/japandaily-hub',
  integrations: [tailwind()],
  output: 'static',
  build: {
    format: 'directory',
  },
});
