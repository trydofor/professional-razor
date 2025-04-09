// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  extends: ['@fessional/razor-common'],
  modules: ['@nuxtjs/ionic'],
  $meta: { name: 'razor-mobile' },
  ssr: false,
  ionic: {
    config: {
      mode: 'md',
    },
  },
});
