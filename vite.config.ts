import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import path from 'path';
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react')) {
                return 'vendor-react'
              }
              if (id.includes('highlightjs')) {
                return 'vendor-highlightjs'
              }
              return 'vendor-others'
            }
          }
        }
      }
    },
    plugins: [
      react(),
      tailwindcss(),
      visualizer()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
