import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      // WebSocket 프록시 설정
      '/chat-socket': {
        target: 'http://host.docker.internal:8080', // Spring 서버 주소
        changeOrigin: true, // Origin 헤더 변경
        ws: true, // WebSocket 프록시 활성화
      },
    },
    strictPort: true,
    cors: true,
    allowedHosts: ['anicare.run', 'front.anicare.run'],
  },
  base: process.env.NODE_ENV === 'development' ? '/' : './',
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name?.split('.').at(1) || 'unknown';
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
  define: { 
    global: "window" // 또는 globalThis를 사용할 수도 있음
  }
  
});
