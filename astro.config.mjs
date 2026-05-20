import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const IS_VERCEL = !!process.env.VERCEL;

const adapter = IS_VERCEL
  ? (await import('@astrojs/vercel/serverless')).default({ webAnalytics: { enabled: true } })
  : undefined;

// Sitemap only in Vercel (hybrid) builds — static build crashes with prerender=false API routes
const integrations = IS_VERCEL
  ? [sitemap({ filter: (page) => !page.includes('/api/') })]
  : [];

export default defineConfig({
  site: IS_VERCEL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL}`
    : 'https://japandaily-hub.github.io',
  base: IS_VERCEL ? '/' : '/japandaily-hub',
  output: IS_VERCEL ? 'hybrid' : 'static',
  ...(adapter ? { adapter } : {}),
  integrations,
  build: { format: 'directory' },
});
