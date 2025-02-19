// https://nuxt.com/docs/api/configuration/nuxt-config

import { fileURLToPath } from 'url';
import { nuxtApiRoutePath, nuxtApiProxyRule, nuxtCompatibilityDate } from './configures/nuxt-config-helper';

export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
    '@pinia/nuxt',
    'nuxt-swiper',
  ],
  // https://nuxt.com/docs/guide/going-further/runtime-config
  runtimeConfig: {
    public: {
      apiRoute: nuxtApiRoutePath(),
      apiProxy: '',
      rehookVueError: true,
      thrownCaptured: true,
    },
  },
  // https://nuxt.com/docs/guide/going-further/layers#tips
  alias: {
    '&razor-common': fileURLToPath(new URL('./', import.meta.url)),
  },
  // https://nitro.build/config#routerules
  routeRules: {
    // nop if apiProxy is empty
    ...nuxtApiProxyRule(),
  },
  compatibilityDate: nuxtCompatibilityDate,
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
