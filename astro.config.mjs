import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://japandaily-hub.github.io',
  base: '/japandaily-hub',
  output: 'static',
  build: {
    format: 'directory',
  },
});
