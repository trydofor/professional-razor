// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url';
import { ApiRoute } from './utils/const-common';

export default defineNuxtConfig({
  modules: ['@unocss/nuxt', '@nuxt/eslint', '@nuxt/test-utils/module', '@pinia/nuxt'],
  alias: {
    '&razor-common': fileURLToPath(new URL('./', import.meta.url)),
  },
  routeRules: {
    [`${ApiRoute}/**`]: process.env.API_PROXY ? { proxy: `${process.env.API_PROXY}` } : undefined,
  },
  compatibilityDate: '2024-10-23',
  typescript: {
    typeCheck: true,
  },
  eslint: {
    config: {
      stylistic: {
        semi: true,
      },
    },
  },
  // https://unocss.dev/integrations/nuxt
  unocss: {
    nuxtLayers: true,
  },
});
