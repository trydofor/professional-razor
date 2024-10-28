import type { AutosizeDirective } from '../plugins/autosize-directive';

declare module '@vue/runtime-core' {
  interface GlobalDirectives {
    vAutosize: AutosizeDirective;
  }
}

//
export {};
