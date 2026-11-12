import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import remarkDocs from './src/lib/remark-docs.mjs';

export default defineConfig({
  site: 'https://openflows.dev',
  integrations: [react(), sitemap()],
  output: 'static',
  redirects: { '/contact': '/resources#contact', '/docs/resources/faq': '/faq' },
  
  // Preserve existing Vite config
  vite: {
    // Keep production builds from replacing the dev server's optimized React
    // runtime while both commands are running locally.
    cacheDir: process.env.npm_lifecycle_event === 'build'
      ? 'node_modules/.vite-openflows-build'
      : 'node_modules/.vite-openflows-dev',
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
  },
  
  // Markdown configuration
  markdown: {
    remarkPlugins: [remarkDocs],
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
