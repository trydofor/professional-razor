export default defineNuxtPlugin({
  name: 'vue-error-debug',
  parallel: true,
  setup(nuxtApp) {
    nuxtApp.hooks.hook('vue:error', (err) => {
      logger.error('vue-error-debug 1:', err);
    });
    nuxtApp.hooks.hook('vue:error', (err) => {
      logger.error('vue-error-debug 2:', err);
    });
  },
});
