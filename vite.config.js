import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  // Only scan our React entry point — prevents Vite from picking up
  // the old static HTML files in blog/, docs/, demos/, etc.
  optimizeDeps: {
    entries: ['./src/main.jsx'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
