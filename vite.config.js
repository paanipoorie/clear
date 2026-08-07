import { defineConfig } from 'vite';

const backendPort = process.env.PORT || 3000;

export default defineConfig({
  root: 'public',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
      },
      '/media': {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
      }
    }
  }
});
