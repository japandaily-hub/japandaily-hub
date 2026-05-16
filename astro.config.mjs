import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://japandaily-hub.github.io',
  base: '/japandaily-hub',
  output: 'static',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
