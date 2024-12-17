import { fileURLToPath } from 'url';
import { mergeConfigs } from '@unocss/core';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore // ERROR(vue-tsc) Could not find a declaration file for module './.nuxt/uno.config.mjs' #115
import config from './.nuxt/uno.config.mjs';

export default mergeConfigs([fileURLToPath(import.meta.url).startsWith(process.cwd()) ? config : {}, {
  rules: [
    ['ion-var-fit', {
      '--width': 'fix-context',
      '--height': 'fit-content',
    }],
    // https://ionicframework.com/docs/api/card
    ['ion-var-card', {
      '--border-radius': '4px',
      '--box-shadow': 'rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px',
    }],
  ],
  shortcuts: [
    {
      'ion-fit-card': 'ion-var-fit ion-var-card',
    },
  ],
}]);
