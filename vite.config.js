import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import createZipPlugin from './src/plugins/zip.js';
import { name } from './package.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), createZipPlugin({ packageName: name })],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    extensions: ['.js', '.jsx']
  }
});
