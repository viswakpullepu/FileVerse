import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50MB to accommodate FFmpeg WASM binaries
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm}']
      },
      manifest: {
        name: 'FileVerze — Private In-Browser File Converter',
        short_name: 'FileVerze',
        description: 'Free, 100% in-browser file converter and privacy powerhouse. Process PDFs, images, videos, 3D models, fonts, and spreadsheets locally.',
        theme_color: '#111827',
        background_color: '#ffffff',
        display: 'standalone',
        categories: ['productivity', 'utilities', 'photo', 'video', 'developer'],
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
