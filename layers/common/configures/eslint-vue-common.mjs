export const rules = {
  // https://eslint.vuejs.org/rules/max-attributes-per-line.html
  'vue/max-attributes-per-line': ['error', { singleline: { max: 3 } }],
  // https://eslint.vuejs.org/rules/component-name-in-template-casing.html
  // component must in PascalCase to distinguish from html tag
  'vue/component-name-in-template-casing': ['error', 'PascalCase', {
    registeredComponentsOnly: false, // nuxt global register
    ignores: [
      '^[^-]+$', // html tag without `-`
      'swiper-container', 'swiper-slide', // https://github.com/cpreston321/nuxt-swiper
    ],
  }],
};

const config = { files: ['**/*.vue'], rules };

export default config;
