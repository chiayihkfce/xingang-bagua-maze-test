import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import javascriptObfuscator from 'vite-plugin-javascript-obfuscator';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    javascriptObfuscator({
      options: {
        compact: true,
        controlFlowFlattening: false, // 關閉此項以大幅提升載入效能與穩定性
        deadCodeInjection: false,
        debugProtection: false, // 由 useSecurityGuard 接手基本防護，避免卡死
        selfDefending: false,   // 關閉此項避免在某些環境下被誤判為篡改而自殺
        splitStrings: false,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 0.75,
        unicodeEscapeSequence: false
      },
      apply: 'build'
    })
  ],
  base: './',
  build: {
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-utils': ['xlsx', 'gsap', 'recharts'],
          'vendor-firebase': [
            'firebase/app',
            'firebase/firestore',
            'firebase/auth'
          ]
        }
      }
    }
  }
});
