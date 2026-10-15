import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import electron from 'vite-plugin-electron/simple';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: 'src/renderer/index.html',
    },
  },
  plugins: [
    react(),
    {
      name: 'content-security-policy',
      apply: 'build',
      transformIndexHtml: () => [
        {
          tag: 'meta',
          attrs: {
            'http-equiv': 'Content-Security-Policy',
            content: "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:",
          },
          injectTo: 'head-prepend',
        },
      ],
    },
    tailwindcss(),
    electron({
      main: { entry: 'src/main/main.ts' },
      preload: {
        input: 'src/preload.ts',
        vite: {
          build: {
            rolldownOptions: {
              output: { entryFileNames: '[name].cjs' },
            },
          },
        },
      },
    }),
  ],
});
