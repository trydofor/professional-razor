import { fileURLToPath } from 'url';
import { mergeConfigs } from '@unocss/core';
// eslint-disable-next-line
// @ts-ignore
import config from './.nuxt/uno.config.mjs';

const ionicColor = (name: string) => ({
  DEFAULT: `var(--ion-color-${name})`,
  contrast: `var(--ion-color-${name}-contrast)`,
  darken: `var(--ion-color-${name}-shade)`,
  lighten: `var(--ion-color-${name}-tint)`,
});

export default mergeConfigs([fileURLToPath(import.meta.url).startsWith(process.cwd()) ? config : {}, {
  rules: [
    ['ion-var-fit', {
      '--width': 'fix-context',
      '--height': 'fit-content',
    }],
    // https://ionicframework.com/docs/api/card
    ['ion-var-card', {
      '--border-radius': '4px',
    }],
    ['color-initial', {
      '--color': 'initial',
    }],
  ],
  shortcuts: [
    {
      'ion-fit-card': 'ion-var-fit ion-var-card',
    },
  ],
  theme: {
    // https://ionicframework.com/docs/layout/css-utilities#ionic-breakpoints
    breakpoints: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
    // https://ionicframework.com/docs/theming/color-generator
    colors: {
      primary: ionicColor('primary'),
      secondary: ionicColor('secondary'),
      tertiary: ionicColor('tertiary'),
      success: ionicColor('success'),
      warning: ionicColor('warning'),
      danger: ionicColor('danger'),
      light: ionicColor('light'),
      medium: ionicColor('medium'),
      dark: ionicColor('dark'),
    },
  },
}]);
