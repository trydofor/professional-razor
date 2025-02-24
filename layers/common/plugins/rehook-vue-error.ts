/**
 * make 'vue:error' hook of nuxt act as onErrorCaptured of vue.
 *
 * - enable by rehookVueError=true
 * - put nuxt-vue-error-hooks to globalThrownCapturer
 *
 * @see https://vuejs.org/api/composition-api-lifecycle.html#onerrorcaptured
 * @see https://nuxt.com/docs/getting-started/error-handling#vue-errors
 */
export default defineNuxtPlugin({
  name: 'rehook-vue-error-plugin',
  enforce: 'pre',
  setup(nuxtApp) {
    if (useRuntimeConfig().public.rehookVueError !== true) return;

    logger.info('enable rehookVueError via globalThrownCapturer');
    nuxtApp.hook('app:created', () => {
      const nuxtHooks = nuxtApp.hooks;

      const _hooks = (nuxtHooks as SafeAny)._hooks;
      if (_hooks == undefined) {
        throw new Error('no _hooks found, check https://github.com/unjs/hookable/blob/main/src/hookable.ts');
      }

      const oldHooks = _hooks['vue:error'] as (Parameters<typeof onErrorCaptured>[0])[];
      if (oldHooks != null && oldHooks.length > 0) {
        const hookName = 'vue:error:rehook' as SafeAny;
        logger.info('rebook %s count=%d', hookName, oldHooks.length);
        for (const hook of oldHooks) {
          nuxtHooks.hook(hookName, hook);
        }
        oldHooks.length = 0; // clear the old hooks
        globalThrownCapturer.put({
          id: 'NuxtVueErrorHooks',
          order: 9000,
          hook: (err, vm, info) => {
            // https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/components/nuxt-root.vue
            nuxtHooks.callHook(hookName, err, vm, info).catch(
              he => logger.error('[nuxt] Error in `vue:error` hook', he),
            );
          },
        }, false);
      }

      nuxtHooks.hook('vue:error', globalThrownCapturer.call as SafeAny);
    });
  },
});
