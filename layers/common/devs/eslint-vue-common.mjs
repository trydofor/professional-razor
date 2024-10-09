/**
 * @type {import('eslint').Linter.RulesRecord}
 */
export const rules = {
  // https://eslint.vuejs.org/rules/max-attributes-per-line.html
  'vue/max-attributes-per-line': ['error', { singleline: { max: 3 } }],
};

/**
 * @type {import('eslint').Linter.Config}
 */
const config = { files: ['**/*.vue'], rules };

export default config;
