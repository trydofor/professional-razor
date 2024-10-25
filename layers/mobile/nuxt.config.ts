// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  extends: ['@fessional/razor-common'],
  modules: ['@nuxtjs/ionic'],
  ssr: false,
  alias: {
    '~razor-mobile': fileURLToPath(new URL('./', import.meta.url)),
  },
  ionic: {
    config: {
      mode: 'md',
    },
  },
});
