import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    assetsInlineLimit: (filePath) => {
      if (/\.(webm|mp4)$/i.test(filePath)) {
        return false;
      }

      return undefined;
    },
  },
});
