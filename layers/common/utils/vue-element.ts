/**
 * select element by its ref or id
 *
 * @param element the element Ref or id
 * @returns the element
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function selectElement(element: Ref<any> | string): HTMLElement & { setFocus?(): void } {
  return typeof element === 'string'
    ? document.getElementById(element)
    : element.value.$el;
}

/**
 * focus the element and scroll it to center, support setFocus() method
 * @param element the element Ref or id
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function focusElement(element: Ref<any> | string) {
  nextTick(() => {
    const ele = selectElement(element);

    if (typeof ele.setFocus === 'function') {
      ele.setFocus();
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
