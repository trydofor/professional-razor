import { fileURLToPath } from 'url';
import { mergeConfigs } from '@unocss/core';
import config from './.nuxt/uno.config.mjs';

export default mergeConfigs([fileURLToPath(import.meta.url).startsWith(process.cwd()) ? config : {}, {
  // https://vuetifyjs.com/en/features/sass-variables/#disabling-utility-classes
  blocklist: [
  ],
}]);
