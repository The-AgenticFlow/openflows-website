import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
    site: 'https://openflows.dev',
    integrations: [
        react(),
        sitemap(),
    ],
    output: 'static',
    build: {
        inlineStylesheets: 'auto',
    },
    vite: {
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
    },
    env: {
        schema: {
            PUBLIC_SUPABASE_URL: {
                type: 'string',
                default: '',
                context: 'client',
                access: 'public',
            },
            PUBLIC_SUPABASE_ANON_KEY: {
                type: 'string',
                default: '',
                context: 'client',
                access: 'public',
            },
        },
    },
});
