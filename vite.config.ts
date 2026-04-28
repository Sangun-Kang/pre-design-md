import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

import { cloudflare } from "@cloudflare/vite-plugin";

const base = process.env.VITE_BASE_PATH ?? (process.env.GITHUB_PAGES === 'true' ? '/pre-design-md/' : '/');

export default defineConfig({
  base,
  plugins: [react(), cloudflare()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
