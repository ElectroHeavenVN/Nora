/**
 * @type {import('electron-vite').UserConfig}
 */
import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    build: {
      rollupOptions: { input: '/src/main/main.ts', external: ['sharp'] }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()],

    build: {
      rollupOptions: { output: { format: 'cjs', entryFileNames: '[name].mjs' } }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve(import.meta.dirname, './src/renderer/src')
      }
    },
    plugins: [react()]
  }
});
