import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import DynamicPublicDirectory from 'vite-multiple-assets';

export default defineConfig({
  plugins: [vue(), legacy(), DynamicPublicDirectory(['../shared/public'])],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
