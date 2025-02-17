export default defineNuxtPlugin({
  name: 'vue-error-debug',
  parallel: true,
  async setup(nuxtApp) {
    nuxtApp.hooks.hook('vue:error', (err) => {
      console.debug('vue-error-debug 1:', err);
    });
    nuxtApp.hooks.hook('vue:error', (err) => {
      console.debug('vue-error-debug 2:', err);
    });
  },
});
