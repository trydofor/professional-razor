﻿/**
 * select element by its ref or id
 *
 * @param element the element Ref or id
 * @returns the element, or throw DOMException if not found
 */
export function selectElement<T = HTMLElement>(element: Ref<SafeAny> | string): T {
  const el = typeof element === 'string'
    ? document.getElementById(element)
    : element.value.$el;

  if (el == null) throw new DOMException(`Element ${element} not found`, 'NotFoundError');
  return el as T;
}

/**
 * focus the element and scroll it to center, support setFocus() method
 * @param element the element Ref or id
 * @param method the focus method name, if not found, use focus()
 */
export function focusElement(element: Ref<SafeAny> | string, method = 'setFocus') {
  return nextTick(() => {
    const ele = selectElement(element) as SafeAny;

    if (typeof ele[method] === 'function') {
      ele[method]();
    }
    else {
      ele.focus();
    }

    ele.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

/**
 * scroll the element to center
 * @param element the element Ref or id
 * @param vertical vertical alignment of the element
 */
export function scrollElement(element: Ref<SafeAny> | string, vertical: 'center' | 'end' | 'nearest' | 'start' = 'center') {
  return nextTick(() => {
    const ele = selectElement(element);
    ele.scrollIntoView({ behavior: 'smooth', block: vertical });
  });
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset
 * ```ts
 * const input = ['a.jpg', 'b.jpg', 'c.jpg'];
 * const expected = {
 *   src: 'a.jpg',
 *   srcset: 'a.jpg, b.jpg 2x, c.jpg 3x',
 * };
 * ```
 */
export function imageDpiSrcset(srcset: string[]) {
  return srcset.length === 0
    ? {}
    : {
        src: srcset[0],
        srcset: srcset.map((img, idx) => idx === 0 ? img : `${img} ${idx + 1}x`).join(', '),
      };
}
