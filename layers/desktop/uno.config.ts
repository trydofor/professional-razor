import { fileURLToPath } from 'url';
import { mergeConfigs } from '@unocss/core';
import config from './.nuxt/uno.config.mjs';
import blocklist from './configures/vuetify-utility-classes.mjs';

export default mergeConfigs([fileURLToPath(import.meta.url).startsWith(process.cwd()) ? config : {}, {
  /*
   * https://vuetifyjs.com/en/features/sass-variables/#disabling-utility-classes
   * https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/styles/settings/_variables.scss
   */
  blocklist,
}]);
