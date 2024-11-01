// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  extends: ['@fessional/play-spa', '@fessional/razor-mobile'],
  modules: ['@nuxtjs/ionic'],
  css: ['~/assets/css/ionic.css'],
  alias: {
    '&h5m': fileURLToPath(new URL('./', import.meta.url)),
  },
  ionic: {
    config: {
      mode: 'md',
    },
  },
});
