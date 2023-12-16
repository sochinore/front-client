import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import nodePolyfills from 'vite-plugin-node-stdlib-browser'
import wasmPlugin from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    nodePolyfills(),
    wasmPlugin(),
    topLevelAwait(),
    legacy()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server:{
    proxy: {
      // with options: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
      '/api': {
        // target: 'http://localhost:9091',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
  }},
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
