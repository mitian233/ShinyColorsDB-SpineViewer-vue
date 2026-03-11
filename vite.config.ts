import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.shinycolors.moe',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/spine'),
      },
      '/cf': {
        target: 'https://cf-static.shinycolors.moe',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cf/, ''),
      },
      '/spine': {
        target: 'https://cf-static.shinycolors.moe',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/spine/, '/spine'),
      },
    },
  },
})
