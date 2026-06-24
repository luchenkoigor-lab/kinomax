import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react-router-dom', 'framer-motion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'uuid'],
  },
  server: {
    host: true,
    port: 5173,
  },
});
