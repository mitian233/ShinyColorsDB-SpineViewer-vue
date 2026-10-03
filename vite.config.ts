import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), tailwindcss(), vueDevTools()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 100 * 1024, // 100KB
          groups: [
            {
              name: 'scui',
              test: /[\\/]node_modules[\\/](?:@mitian233[\\/]scui|reka-ui)[\\/]/,
              priority: 20,
            },
          ],
        },
      },
    },
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
