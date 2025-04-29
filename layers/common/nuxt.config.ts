// https://nuxt.com/docs/api/configuration/nuxt-config

import { nuxtPublicApiRoute, nuxtPublicDevProxy, nuxtCompatibilityDate } from './configures/nuxt-config-helper';

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@unocss/nuxt',
    'nuxt-swiper',
  ],
  $meta: { name: 'razor-common' },
  runtimeConfig: { // https://nuxt.com/docs/guide/going-further/runtime-config
    public: {
      apiRoute: nuxtPublicApiRoute(),
      devProxy: '',
      rehookVueError: true,
      loggerLevel: '', // LogLevels
    },
  },
  compatibilityDate: nuxtCompatibilityDate,
  nitro: { // https://nitro.build/config#devproxy
    devProxy: {
      ...nuxtPublicDevProxy(),
    },
  },
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
  i18n: { // https://i18n.nuxtjs.org/docs/guide/layers
    bundle: {
      optimizeTranslationDirective: false,
    },
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'Wings-Locale',
      redirectOn: 'root',
    },
    experimental: {
      autoImportTranslationFunctions: true,
    },
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en-US.ts',
        language: 'en-US', // https://i18n.nuxtjs.org/docs/guide/seo
      },
      {
        code: 'zh',
        name: '简体中文',
        file: 'zh-CN.ts',
        language: 'zh-CN',
      },
    ],
    strategy: 'no_prefix',
  },
  unocss: { // https://unocss.dev/integrations/nuxt
    nuxtLayers: true,
  },
});
