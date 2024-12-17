declare module '@vue/runtime-core' {
  import type { AutosizeDirective } from '../plugins/autosize-directive';

  interface GlobalDirectives {
    vAutosize: AutosizeDirective;
  }
}

declare module 'uno.config.mjs' {
  import type { UserConfig } from '@unocss/core';

  const config: UserConfig<object>;
  export default config;
}

//
export {};
