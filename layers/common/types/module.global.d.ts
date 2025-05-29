import type { AutosizeDirective } from '../plugins/autosize-directive';

declare module '@vue/runtime-core' {
  interface GlobalDirectives {
    vAutosize: AutosizeDirective;
  }
}

// no declaration for .nuxt/uno.config.mjs #246
declare module './.nuxt/uno.config.mjs' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config: any;
  export default config;
}

// declare module '#app' {
//   interface NuxtApp {
//     $thrownCaptured: ReturnType<typeof useThrownCaptured>;
//   }
// }

// declare module 'vue' {
//   interface ComponentCustomProperties {
//     $thrownCaptured: ReturnType<typeof useThrownCaptured>;
//   }
// }

//
export {};
