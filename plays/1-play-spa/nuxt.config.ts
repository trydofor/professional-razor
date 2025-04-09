// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  extends: ['@fessional/razor-common'],
  modules: ['@sentry/nuxt/module'],
  $meta: { name: 'spa' },
  ssr: false,
  devtools: { enabled: true },
  css: ['#layers/spa/assets/css/common.css'],
  router: {
    options: {
      hashMode: true,
    },
  },
  sourcemap: { client: 'hidden' },
  compatibilityDate: '2024-10-23',
  // https://docs.sentry.io/platforms/javascript/guides/nuxt/configuration/options/#debug
  sentry: {
    debug: true,
    sourceMapsUploadOptions: {
      org: 'moilioncirclecom',
      project: 'razor',
      authToken: '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',
    },
  },
});
