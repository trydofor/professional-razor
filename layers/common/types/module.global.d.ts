declare module '@vue/runtime-core' {
  import type { AutosizeDirective } from '../plugins/autosize-directive';

  interface GlobalDirectives {
    vAutosize: AutosizeDirective;
  }
}

//
export {};
