// https://nuxt.com/docs/api/configuration/nuxt-config

import { nuxtI18nLocales } from '@fessional/razor-common/configures/nuxt-config-helper';

export default defineNuxtConfig({
  extends: ['@fessional/razor-common'],
  modules: ['vuetify-nuxt-module'],
  $meta: { name: 'razor-desktop' },
  ssr: false,
  i18n: {
    locales: nuxtI18nLocales,
  },
  vuetify: {
    moduleOptions: {
      // useLocale -> useVLocale
      prefixComposables: true,
      // modern-compiler
      disableModernSassCompiler: false,
    },
    /*
     * project: vuetify.config.ts for
     * layer: vuetifyOptions
     */
    vuetifyOptions: {
      // https://nuxt.vuetifyjs.com/guide/icons/unocss-preset-icons.html
      icons: {
        defaultSet: 'unocss-mdi',
      },
      // https://nuxt.vuetifyjs.com/guide/date.html
      date: {
        /**
         * ERROR: does not provide an export named 'en' for date-fns (export enUS)
         * https://github.com/vuetifyjs/nuxt-module/issues/318
         */
        adapter: 'vuetify',
      },
    },
  },
});
