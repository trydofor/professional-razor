// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
