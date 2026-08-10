import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    vueDevTools(),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
        },
      ],
      dts: true,
    }),
    Components({
      resolvers: [NaiveUiResolver()],
      dts: true,
    }),
  ],
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
              name: 'naive-ui',
              test: /[\\/]node_modules[\\/]naive-ui[\\/]/,
              priority: 20,
            },
          ],
        },
      },
    },
  },
  server: {
    proxy: {
      // API: /api/dresslist -> https://api.shinycolors.moe/spine/dresslist
      '/api': {
        target: 'https://api.shinycolors.moe',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/spine'),
      },
      // Misc CF assets (non-spine)
      '/cf': {
        target: 'https://cf-static.shinycolors.moe',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cf/, ''),
      },
      // Spine assets: path already includes /spine/... (idols, awake_idols,
      // idol_evolution_skins, support_idols, sub_characters, etc.)
      // /spine/idols/stand/101/data.json -> cf-static.shinycolors.moe/spine/idols/...
      '/spine': {
        target: 'https://cf-static.shinycolors.moe',
        changeOrigin: true,
      },
    },
  },
})
