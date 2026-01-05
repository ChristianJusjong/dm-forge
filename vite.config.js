import { defineConfig } from 'vite'

import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Dungeon Master Forge',
        short_name: 'DM Forge',
        description: 'Complete D&D 5e toolkit for Dungeon Masters',
        theme_color: '#d4af37',
        background_color: '#0a0604',
        display: 'standalone',
        orientation: 'any',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.open5e\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    visualizer({
      open: false, // Set to true to open automatically after build
      gzipSize: true,
      brotliSize: true,
      filename: './dist/stats.html'
    })
  ],
  server: {
    port: 3000
  },
  build: {
    // Code splitting and optimization
    rollupOptions: {
      output: {
        // Manual code splitting for better caching
        manualChunks: {
          // Utils chunk (shared utilities) - Support both .js and .ts
          'utils': [
            './storage-utils.js',
            './storage-utils.ts',
            './sanitize-utils.js',
            './validation-schemas.js',
            './validation-schemas.ts',
            './sync-utils.js',
            './data-manager.js'
          ],

          // Firebase & Cloud Sync
          'firebase': [
            './firebase-config.js',
            './cloud-sync.js',
            './cloud-sync.ts'
          ],

          // Feature chunks (lazy loaded)
          'campaign': ['./campaign-manager.js'],
          'auth': ['./auth.js']
        },

        // Asset file names with hash for cache busting
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg|webp)$/i.test(name ?? '')) {
            return 'images/[name]-[hash][extname]';
          }

          if (/\.css$/i.test(name ?? '')) {
            return 'css/[name]-[hash][extname]';
          }

          return 'assets/[name]-[hash][extname]';
        }
      }
    },

    // Minification with terser
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console.log in production
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log', 'console.debug'], // Remove specific functions
        passes: 2 // Multiple compression passes
      },
      format: {
        comments: false // Remove all comments
      }
    },

    // Source maps for debugging (disable in production for smaller size)
    sourcemap: false,

    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb

    // CSS code splitting
    cssCodeSplit: true,

    // Chunk size warnings
    chunkSizeWarningLimit: 500,

    // Target modern browsers for smaller builds
    target: 'es2020',

    // Report compressed size
    reportCompressedSize: true
  },

  // Optimization hints
  optimizeDeps: {
    include: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
    exclude: []
  },

  // Resolve configuration for TypeScript
  resolve: {
    alias: {
      '@': '/src'
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },

  // CSS preprocessing
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      // Add any CSS preprocessor options here
    }
  }
})
