import type { Directive } from 'vue';

/**
 * NOTE1: This directive is only available on the client side.
 * and if no width or height is specified, it will be applied to both.
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
 * <div v-autosize class="transition-height duration-500 overflow-hidden">
 *   <div v-show="show" class="p-4 bg-gray-200">
 *     details to show/hide
 *   </div>
 * </div>
 * ```
 */
export type AutosizeDirective = Directive<HTMLElement, undefined, string, 'width' | 'height'>;

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
      el.style.width = 'auto';
    }

    if (sz.height != null) {
      sz.height = el.scrollHeight;
      el.style.height = 'auto';
    }
  },

  updated(el) {
    const sz = el.__autosize;
    if (sz == null) return;

    let widthPx: string | undefined;
    if (sz.width != null) {
      const w = el.scrollWidth;
      widthPx = w != sz.width ? `${w}px` : undefined;
      el.style.width = `${sz.width}px`;
    }

    let heightPx: string | undefined;
    if (sz.height != null) {
      const h = el.scrollHeight;
      heightPx = h != sz.height ? `${h}px` : undefined;
      el.style.height = `${sz.height}px`;
    }

    // console.log('__autosize' + el.id, sz.width, widthPx, sz.height, heightPx);

    if (widthPx || heightPx) {
      setTimeout(() => {
        if (widthPx) el.style.width = widthPx;
        if (heightPx) el.style.height = heightPx;
      }, 0);
    }
  },
} as Directive<HTMLElement & { __autosize?: { width?: number; height?: number } }, undefined, string, 'width' | 'height'>;

export default defineNuxtPlugin((nuxtApp) => {
  const autosize = nuxtApp.ssrContext ? {} : clientAutosizeDirective;
  nuxtApp.vueApp.directive('autosize', autosize);
});
