import type { Directive } from 'vue';

/**
 * NOTE1: This directive is only for the client, NOP on the server.
 * and if no width or height is specified, it will be applied to both.
 * use v-autosize="id-for-debug" to debug the size in log.
 *
 * WARN2: transition-height is not work if height=auto or display=none.
 * so you should use div to wrap the content with display=none.
 *
 * WARN3: should use overflow-hidden if the size is wrong.
 * may be caused by both width and height is autosize.
 *
 * WARN4: if the transition failed when clicking through many elements.
 * (1) `@click.stop` to stop event from child to parent.
 * (2) `v-autosizes:height="{ debounce: 1000 }` to debounce (default 500ms)
 *
 * ```vue
 * <div v-autosize:height class="transition-height duration-500">
 *   <div v-show="show" class="p-4 bg-gray-200">
 *     details to show/hide
 *   </div>
 * </div>
 *
 * <div v-autosize="show-box" class="transition-height duration-500 overflow-hidden">
 *   <div v-show="show" class="p-4 bg-gray-200">
 *     details to show/hide
 *   </div>
 * </div>
 * ```
 */
export type AutosizeDirective = Directive<HTMLElement, {
  /**
   * debug id shown in log
   */
  debug?: string | number;
  /**
   * debounce to set style in ms, default 500
   */
  debounce?: number;
} | string | number, string, 'width' | 'height'>;

type AutosizeInnerData = {
  __autosize: {
    last: number;
    skip: boolean;
    debounce: number;
    debug?: string;
    width?: number;
    height?: number;
  };
};

export const clientAutosizeDirective = {
  mounted(el, bd) {
    el.__autosize = { last: 0, skip: false, debounce: 500 };

    const vl = bd.value;
    switch (typeof vl) {
      case 'string':
      case 'number':
        el.__autosize.debug = vl.toString();
        break;
      case 'object':
        if (vl.debug != null) {
          el.__autosize.debug = vl.debug.toString();
        }
        if (vl.debounce != null) {
          el.__autosize.debounce = vl.debounce;
        }
    }

    switch (bd.arg) {
      case 'width':
        el.__autosize.width = 0;
        break;
      case 'height':
        el.__autosize.height = 0;
        break;
      default:
        el.__autosize.width = 0;
        el.__autosize.height = 0;
    }
  },

  beforeUpdate(el, bd) {
    const asz = el.__autosize;

    if (asz.debug) {
      // no need of dynamic debounce
      const vl = bd.value;
      if (typeof vl === 'object' && vl.debounce != null) {
        asz.debounce = vl.debounce;
      }
    }

    if (asz.debounce > 0) {
      const tm = Date.now();
      if (asz.last > tm) {
        asz.skip = true;
        return;
      }
      asz.last = tm + asz.debounce;
    }

    asz.skip = false;

    if (asz.width != null) {
      asz.width = el.scrollWidth;
      // set 'auto' to enable calculate
      el.style.width = 'auto';
    }

    if (asz.height != null) {
      asz.height = el.scrollHeight;
      // set 'auto' to enable calculate
      el.style.height = 'auto';
    }
  },

  updated(el) {
    const asz = el.__autosize;
    if (asz.skip) return;

    let widthPx = null;
    if (asz.width != null) {
      const w = el.scrollWidth;
      if (w !== asz.width) widthPx = `${w}px`;
      // rewrite 'auto' on beforeUpdate
      el.style.width = `${asz.width}px`;
    }

    let heightPx = null;
    if (asz.height != null) {
      const h = el.scrollHeight;
      if (h !== asz.height) heightPx = `${h}px`;
      // rewrite 'auto' on beforeUpdate
      el.style.height = `${asz.height}px`;
    }

    if (asz.debug) {
      console.log(`DEBUG: __autosize debug=${asz.debug}, style=${
        widthPx != null || heightPx != null
      }: w2=${widthPx}, h2=${heightPx}, data=${
        JSON.stringify(asz)
      }`);
    }

    if (widthPx != null || heightPx != null) {
      // set final size at next thread
      setTimeout(() => {
        if (widthPx != null) el.style.width = widthPx;
        if (heightPx != null) el.style.height = heightPx;
      }, 0);
    }
  },
} as Directive<
  HTMLElement & AutosizeInnerData,
  { debug?: string | number; debounce?: number } | string | number,
  string,
  'width' | 'height'
>;

export default defineNuxtPlugin({
  name: 'autosize-directive-plugin',
  enforce: 'post',
  setup(nuxtApp) {
    const autosize = nuxtApp.ssrContext ? {} : clientAutosizeDirective;
    // to avoid error on server
    nuxtApp.vueApp.directive('autosize', autosize);
  },
});
