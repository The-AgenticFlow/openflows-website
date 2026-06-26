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
        server: {
            allowedHosts: ['keisha-unterrifying-winona.ngrok-free.dev'],
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
            PUBLIC_GISCUS_REPO: {
                type: 'string',
                default: '',
                context: 'client',
                access: 'public',
            },
            PUBLIC_GISCUS_REPO_ID: {
                type: 'string',
                default: '',
                context: 'client',
                access: 'public',
            },
            PUBLIC_GISCUS_CATEGORY: {
                type: 'string',
                default: 'General',
                context: 'client',
                access: 'public',
            },
            PUBLIC_GISCUS_CATEGORY_ID: {
                type: 'string',
                default: '',
                context: 'client',
                access: 'public',
            },
        },
    },
});
