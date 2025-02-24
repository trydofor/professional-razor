import type { AutosizeDirective } from '../plugins/autosize-directive';

declare module '@vue/runtime-core' {
  interface GlobalDirectives {
    vAutosize: AutosizeDirective;
  }
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
