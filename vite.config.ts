import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import javascriptObfuscator from 'vite-plugin-javascript-obfuscator'
import { viteSingleFile } from "vite-plugin-singlefile"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    javascriptObfuscator({
      options: {
        compact: true,
        controlFlowFlattening: false, 
        deadCodeInjection: false,
        debugProtection: false,
        selfDefending: false,
        simplify: true,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 0.75,
      },
    }),
    viteSingleFile()
  ],
  base: './', 
  build: {
    sourcemap: false,
    assetsInlineLimit: 0, // 核心修正：強制圖標、海報走外部連結，不准塞進 HTML
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  }
})
