import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

export default defineConfig({
  base: '/openflows-website/',
  plugins: [
    react(),
    {
      name: 'spa-404',
      apply: 'build',
      closeBundle() {
        const dist = path.resolve('dist')
        fs.copyFileSync(
          path.join(dist, 'index.html'),
          path.join(dist, '404.html')
        )
      },
    },
  ],

  server: {
    host: true,
    allowedHosts: true,
  },

  optimizeDeps: {
    entries: ['./src/main.jsx'],
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})