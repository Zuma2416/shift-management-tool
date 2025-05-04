import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  base: '/shift-management-tool/',
  build: {
    rollupOptions: {
      external: [
        '@fontsource/roboto/300.css',
        '@fontsource/roboto/400.css',
        '@fontsource/roboto/500.css',
        '@fontsource/roboto/700.css'
      ]
    }
  }
}) 