/**
 * make 'vue:error' hook of nuxt act as onErrorCaptured of vue
 *
 * @see https://vuejs.org/api/composition-api-lifecycle.html#onerrorcaptured
 * @see https://nuxt.com/docs/getting-started/error-handling#vue-errors
 */

export default defineNuxtPlugin({
  name: 'rehook-vue-error-plugin',
  enforce: 'pre',
  setup(nuxtApp) {
    const config = useRuntimeConfig().public;
    const thrownCaptured = useThrownCaptured();

    if (config.rehookVueError === true) {
      console.debug('rehookVueError enabled');
      nuxtApp.hook('app:created', () => {
        const nuxtHooks = nuxtApp.hooks;

        const _hooks = (nuxtHooks as SafeAny)._hooks;
        if (_hooks == undefined) {
          throw new Error('no _hooks found, check https://github.com/unjs/hookable/blob/main/src/hookable.ts');
        }

        const oldHooks = _hooks['vue:error'] as (Parameters<typeof onErrorCaptured>[0])[];
        if (oldHooks != null && oldHooks.length > 0) {
          const hookName = 'vue:error:rehook' as SafeAny;
          console.debug(`rebook ${hookName} count=${oldHooks.length}`);
          for (const hook of oldHooks) {
            nuxtHooks.hook(hookName, hook);
          }
          oldHooks.length = 0; // clear the old hooks
          thrownCaptured.putThrownHook('999.call-nuxt-vue-error-hooks', (err, vm, info) => {
            // https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/components/nuxt-root.vue
            nuxtHooks.callHook(hookName, err, vm, info);
          });
        }

        nuxtHooks.hook('vue:error', thrownCaptured.callThrownHook as SafeAny);
      });
    }

    if (config.thrownCaptured === true) {
      console.debug('thrownCaptured provided');
      return {
        provide: {
          thrownCaptured,
        },
      };
    }
  },
});
