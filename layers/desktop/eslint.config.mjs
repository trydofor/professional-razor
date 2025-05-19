import unocss from '@unocss/eslint-config/flat';
import vueCommon from '@fessional/razor-common/configures/eslint-vue-common.mjs';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  unocss,
  vueCommon,
);
