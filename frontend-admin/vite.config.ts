import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'https://announcement-platform-s582.onrender.com',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://announcement-platform-s582.onrender.com',
        changeOrigin: true,
      },
    },
  },
});
