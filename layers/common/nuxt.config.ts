import presetIcons from '@unocss/preset-icons';
import presetWind from '@unocss/preset-wind';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-09-17',
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', '@nuxt/eslint', '@nuxt/test-utils/module'],
  unocss: {
    nuxtLayers: true,
    presets: [presetWind(), presetIcons()],
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
