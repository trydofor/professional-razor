import type { AutosizeDirective } from '../plugins/autosize-directive.client';

declare module '@vue/runtime-core' {

  interface GlobalDirectives {
    vAutosize: AutosizeDirective;
  }
}

//
export {};
