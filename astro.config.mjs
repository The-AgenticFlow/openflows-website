import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://openflows.dev',
  integrations: [react(), sitemap()],
  output: 'static',
  
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
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
