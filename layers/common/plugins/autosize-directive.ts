import type { Directive } from 'vue';

/**
 * NOTE1: This directive is only available on the client side.
 * and if no width or height is specified, it will be applied to both.
 * use v-autosize="id-for-debug" to debug the size in log.
 *
 * WARN2: transition-height is not work if height=auto or display=none.
 * so you should use div to wrap the content with display=none.
 *
 * WARN3: should use overflow-hidden if the size is wrong.
 * may be caused by both width and height is autosize.
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
export type AutosizeDirective = Directive<HTMLElement, string, string, 'width' | 'height'>;

export const clientAutosizeDirective = {
  mounted(el, bd) {
    switch (bd.arg) {
      case 'width':
        el.__autosize = { width: 0 };
        break;
      case 'height':
        el.__autosize = { height: 0 };
        break;
      default:
        el.__autosize = { width: 0, height: 0 };
    }
  },

  beforeUpdate(el) {
    const sz = el.__autosize;
    if (sz == null) return;

    if (sz.width != null) {
      sz.width = el.scrollWidth;
      // set 'auto' to enable calculate
      el.style.width = 'auto';
    }

    if (sz.height != null) {
      sz.height = el.scrollHeight;
      // set 'auto' to enable calculate
      el.style.height = 'auto';
    }
  },

  updated(el, bd) {
    const sz = el.__autosize;
    if (sz == null) return;

    let widthPx = null;
    if (sz.width != null) {
      const w = el.scrollWidth;
      if (w !== sz.width) widthPx = `${w}px`;
      // rewrite 'auto' on beforeUpdate
      el.style.width = `${sz.width}px`;
    }

    let heightPx = null;
    if (sz.height != null) {
      const h = el.scrollHeight;
      if (h !== sz.height) heightPx = `${h}px`;
      // rewrite 'auto' on beforeUpdate
      el.style.height = `${sz.height}px`;
    }

    if (bd.value) {
      console.log(`DEBUG: __autosize ${bd.value}: df=${widthPx != null || heightPx != null} w1=${sz.width}, w2=${widthPx}, h1=${sz.height}, h2=${heightPx}`);
    }

    if (widthPx != null || heightPx != null) {
      // set final size at next thread
      setTimeout(() => {
        if (widthPx != null) el.style.width = widthPx;
        if (heightPx != null) el.style.height = heightPx;
      }, 0);
    }
  },
} as Directive<HTMLElement & { __autosize?: { width?: number; height?: number } }, string, string, 'width' | 'height'>;

export default defineNuxtPlugin((nuxtApp) => {
  const autosize = nuxtApp.ssrContext ? {} : clientAutosizeDirective;
  nuxtApp.vueApp.directive('autosize', autosize);
});
