// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  alias: {
    '~razor-common': fileURLToPath(new URL('./', import.meta.url)),
  },
  compatibilityDate: '2024-09-17',
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', '@nuxt/eslint', '@nuxt/test-utils/module'],
  // https://unocss.dev/integrations/nuxt
  unocss: {
    nuxtLayers: true,
  },
  eslint: {
    checker: true,
    config: {
      stylistic: {
        semi: true,
      },
    },
  },
  typescript: {
    typeCheck: true,
  },
});
