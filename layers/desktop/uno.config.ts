import { fileURLToPath } from 'url';
import { mergeConfigs } from '@unocss/core';
// eslint-disable-next-line
// @ts-ignore
import config from './.nuxt/uno.config.mjs';
import blocklist from './configures/vuetify-utility-classes.mjs';

const vuetifyColor = (name: string) => ({
  DEFAULT: `rgba(var(--v-theme-${name}), 1)`,
  contrast: `rgba(var(--v-theme-on-${name}), 1)`,
  darken: `rgba(var(--v-theme-${name}-darken-1), 1)`,
  lighten: `rgba(var(--v-theme-${name}-lighten-1), 1)`,
});

export default mergeConfigs([fileURLToPath(import.meta.url).startsWith(process.cwd()) ? config : {}, {
  // https://github.com/vuetifyjs/nuxt-module/issues/317
  blocklist,
  theme: {
    // https://vuetifyjs.com/en/features/display-and-platform/#breakpoints-and-thresholds
    breakpoints: {
      sm: '600px',
      md: '960px',
      lg: '1280px',
      xl: '1920px',
      xxl: '2560px',
    },
    // https://ionicframework.com/docs/theming/color-generator
    colors: {
      primary: vuetifyColor('primary'),
      secondary: vuetifyColor('secondary'),
      tertiary: vuetifyColor('tertiary'),
      success: vuetifyColor('success'),
      warning: vuetifyColor('warning'),
      error: vuetifyColor('error'),
      info: vuetifyColor('info'),
    },
  },
}]);
