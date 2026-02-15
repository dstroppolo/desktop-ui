import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/desktop-ui/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      'desktop-ui': resolve(__dirname, '../../packages/desktop-ui/src/index.ts'),
    },
  },
});
