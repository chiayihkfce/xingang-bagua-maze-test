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
        controlFlowFlattening: true, 
        controlFlowFlatteningThreshold: 0.8,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        debugProtection: true,
        debugProtectionInterval: 4000,
        numbersToExpressions: true,
        selfDefending: true,
        simplify: true,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 0.8,
        splitStrings: true,
        unicodeEscapeSequence: true,
        rotateStringArray: true,
        shuffleStringArray: true
      },
    }),
    viteSingleFile()
  ],
  base: './', // Ensures relative paths for GitHub Pages
  build: {
    sourcemap: false,
    assetsInlineLimit: 100000000, // 確保所有資產都被嵌入
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  }
})
