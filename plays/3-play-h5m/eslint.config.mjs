// @ts-check
import vueCommon from '@fessional/razor-common/devs/eslint-vue-common.mjs';
import vueIonic from '@fessional/razor-mobile/devs/eslint-vue-ionic.mjs';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  vueCommon,
  vueIonic,
);
