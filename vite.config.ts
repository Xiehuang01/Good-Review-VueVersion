import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
    const isProduction = mode === 'production';
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [vue()],
      base: '/Good-Review-VueVersion/',
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      },
      // 支持SPA路由
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['vue', 'vue-router']
            }
          }
        }
      }
    };
});
