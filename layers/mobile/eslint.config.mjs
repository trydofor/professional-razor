// @ts-check
import vueIonic from './configures/eslint-vue-ionic.mjs';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  vueIonic,
);
