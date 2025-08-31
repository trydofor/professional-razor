// vuetify.config.ts
import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration';

export default defineVuetifyConfiguration({
  theme: {
    // https://vuetifyjs.com/en/features/theme/
    defaultTheme: 'light',
    variations: {
      colors: ['primary', 'secondary', 'tertiary'],
      lighten: 1,
      darken: 1,
    },
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#6C6BEF',
          secondary: '#31D8D4',
          tertiary: '#A8B0FF',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#6C6BEF',
          secondary: '#31D8D4',
          tertiary: '#A8B0FF',
        },
      },
    },
  },
});
