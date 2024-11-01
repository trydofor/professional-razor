// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  extends: ['@fessional/razor-common'],
  ssr: false,
  devtools: { enabled: true },
  css: ['&spa/assets/css/common.css'],
  router: {
    options: {
      hashMode: true,
    },
  },
  alias: {
    '&spa': fileURLToPath(new URL('./', import.meta.url)),
  },
  compatibilityDate: '2024-10-23',
});
