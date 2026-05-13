import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// SITE_URL と BASE_PATH は GitHub Actions が自動で注入します。
// ローカル開発時はフォールバック値が使われます。
export default defineConfig({
  site: process.env.SITE_URL  ?? 'http://localhost:4321',
  base: process.env.BASE_PATH ?? '/',
  integrations: [tailwind()],
  output: 'static',
});
