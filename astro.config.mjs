import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  // Vercel デプロイ時は site を本番ドメインに更新してください
  site: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://japandaily-hub.github.io',
  // Vercel では base は不要（ルートにデプロイされる）
  base: process.env.VERCEL_URL ? '/' : '/japandaily-hub',
  // hybrid: 静的ページはそのまま、API Routes だけ SSR
  output: 'hybrid',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  build: {
    format: 'directory',
  },
});
