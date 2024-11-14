// @ts-check
import vueCommon from '@fessional/razor-common/configures/eslint-vue-common.mjs';
import vueIonic from '@fessional/razor-mobile/configures/eslint-vue-ionic.mjs';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  vueCommon,
  vueIonic,
);
