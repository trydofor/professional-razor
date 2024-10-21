/**
 * select element by its ref or id
 *
 * @param element the element Ref or id
 * @returns the element
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function selectElement<T = HTMLElement>(element: Ref<any> | string): T {
  return typeof element === 'string'
    ? document.getElementById(element)
    : element.value.$el;
}

/**
 * focus the element and scroll it to center, support setFocus() method
 * @param element the element Ref or id
 * @param method the focus method name, if not found, use focus()
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function focusElement(element: Ref<any> | string, method = 'setFocus') {
  nextTick(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ele = selectElement(element) as any;

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
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function scrollElement(element: Ref<any> | string) {
  nextTick(() => {
    const ele = selectElement(element);
    ele.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
