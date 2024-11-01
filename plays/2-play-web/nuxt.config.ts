// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  extends: ['@fessional/play-spa'],
  alias: {
    '&web': fileURLToPath(new URL('./', import.meta.url)),
  },
});
