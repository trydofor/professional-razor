import type { SetupContext } from 'vue';
import IonicHtmlAliases from '../configures/ionic-html-aliases.mjs';

export default defineNuxtPlugin({
  name: 'ionic-html-aliases',
  setup: (nuxtApp) => {
    const app = nuxtApp.vueApp;
    Object.entries(IonicHtmlAliases).forEach(([alias, original]) => {
      app.component(alias, {
        inheritAttrs: true,
        setup(_: unknown, { slots, attrs }: SetupContext) {
          return () => h(original, attrs, slots);
        },
      });
    });
  },
});
