// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  extends: ['@fessional/play-spa', '@fessional/razor-mobile'],
  $meta: { name: 'mob' },
  css: ['~/assets/css/ionic.css'],
  ionic: {
    config: {
      mode: 'md',
    },
  },
});
