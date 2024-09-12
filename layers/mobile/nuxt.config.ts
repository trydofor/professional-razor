// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  extends: ['@fessional/razor-common'],
  modules: ['@nuxtjs/ionic'],
  ssr: false,
  ionic: {
    config: {
      mode: 'md',
    },
  },
});
