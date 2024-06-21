import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // import with @
    },
  },
  server: {
    proxy: {
      '/api': {
        // REST call to /api/... will be proxied to http://localhost:8000/api/...
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
