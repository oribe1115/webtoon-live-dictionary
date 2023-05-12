import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/tesseract-wasm/dist/tesseract-core.wasm',
          dest: 'tesseract-wasm-files'
        },
        {
          src: 'node_modules/tesseract-wasm/dist/tesseract-core-fallback.wasm',
          dest: 'tesseract-wasm-files'
        },
        {
          src: 'node_modules/tesseract-wasm/dist/tesseract-worker.js',
          dest: 'tesseract-wasm-files'
        }
      ]
    })
  ]
})
