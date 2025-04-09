// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  extends: ['@fessional/play-spa', '@fessional/razor-mobile'],
  modules: ['@nuxtjs/ionic'],
  $meta: { name: 'h5m' },
  css: ['~/assets/css/ionic.css'],
  ionic: {
    config: {
      mode: 'md',
    },
  },
});
