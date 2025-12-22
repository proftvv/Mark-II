import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          pdf: ['pdfjs-dist', 'react-pdf']
        }
      }
    }
  },
  server: {
    allowedHosts: [".trycloudflare.com"],
    proxy: {
      '/auth': 'http://localhost:3000',
      '/templates': 'http://localhost:3000',
      '/reports': 'http://localhost:3000',
      '/users': 'http://localhost:3000',
      '/logs': 'http://localhost:3000',
      '/files': 'http://localhost:3000'
    }
  }
})
