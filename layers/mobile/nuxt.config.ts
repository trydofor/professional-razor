// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  alias: {
    '~razor-mobile': fileURLToPath(new URL('./', import.meta.url)),
  },
  extends: ['@fessional/razor-common'],
  modules: ['@nuxtjs/ionic'],
  ssr: false,
  ionic: {
    config: {
      mode: 'md',
    },
  },
});
