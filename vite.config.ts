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
