import { mergeConfigs } from '@unocss/core';
import config from './.nuxt/uno.config.mjs';

export default mergeConfigs([config, {
  theme: {
    // https://ionicframework.com/docs/layout/css-utilities#content-space
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
    // https://ionicframework.com/docs/theming/color-generator
    colors: {
      'primary': '#6e6def',
      'primary-contrast': '#ffffff',
      'secondary': '#5bc0d7',
      'secondary-contrast': '#ffffff',
      'tertiary': '#0163aa',
      'tertiary-contrast': '#ffffff',
      'success': '#2dd55b',
      'warning': '#ffc409',
      'danger': '#c5000f',
      'light': '#f6f8fc',
      'medium': '#5f5f5f',
      'dark': '#2f2f2f',
    },
  },
}]);
