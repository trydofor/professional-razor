// @ts-check
import vueCommon from './devs/eslint-vue-common.mjs';
import withNuxt from './.nuxt/eslint.config.mjs';

// https://eslint.nuxt.com/packages/module
export default withNuxt(
  vueCommon,
);
