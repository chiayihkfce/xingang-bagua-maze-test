import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import javascriptObfuscator from 'vite-plugin-javascript-obfuscator'

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
        debugProtectionInterval: 0,
        disableConsoleOutput: false,
        selfDefending: true,
        splitStrings: false, // 關鍵：設為 false 避免破壞動態導入路徑
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 0.5,
      },
    })
    ],
    base: './', 
    build: {
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-utils': ['xlsx', 'gsap', 'recharts'],
          'vendor-firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
        },
      },
    },
  }
})
