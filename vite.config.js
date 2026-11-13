import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    watch: {
      ignored: ['**/videos1/**', '**/*.crdownload', '**/dist/**']
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separate node_modules dependencies into dedicated chunks
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-vendor';
            }
            if (id.includes('react') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            return 'vendor'; // all other third-party packages
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000 // raises warning threshold cleanly to 1MB if needed
  }
});
