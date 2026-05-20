import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const IS_VERCEL = !!process.env.VERCEL;

const adapter = IS_VERCEL
  ? (await import('@astrojs/vercel/serverless')).default({ webAnalytics: { enabled: true } })
  : undefined;

export default defineConfig({
  site: IS_VERCEL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL}`
    : 'https://japandaily-hub.github.io',
  base: IS_VERCEL ? '/' : '/japandaily-hub',
  output: IS_VERCEL ? 'hybrid' : 'static',
  ...(adapter ? { adapter } : {}),
  integrations: [sitemap({ filter: (page) => !page.includes('/api/') })],
  build: { format: 'directory' },
});
