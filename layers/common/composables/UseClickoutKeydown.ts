import type { KeyFilter, MaybeElementRef } from '@vueuse/core';
import { onKeyDown, onClickOutside } from '@vueuse/core';

/**
 * listen PointerEvent or KeyboardEvent
 *
 * - click outside of the element
 * - keydown, default `Escape`
 */
export function useClickoutKeydown(eleRef: MaybeElementRef, keys: KeyFilter = 'Escape', handler: (evt: PointerEvent | KeyboardEvent) => void) {
  let clickoutStub: (() => void) | null = null;
  let keydownStub: (() => void) | null = null;

  function active(force: boolean = false) {
    if (clickoutStub == null) {
      clickoutStub = onClickOutside(eleRef, handler);
    }
    else if (force) {
      clickoutStub();
      clickoutStub = onClickOutside(eleRef, handler);
    }

    if (keydownStub == null) {
      keydownStub = onKeyDown(keys, handler);
    }
    else if (force) {
      keydownStub();
      keydownStub = onKeyDown(keys, handler);
    }
  }

  function inactive() {
    if (clickoutStub != null) {
      clickoutStub();
      clickoutStub = null;
    }
    if (keydownStub != null) {
      keydownStub();
      keydownStub = null;
    }
  }

  return { active, inactive };
}
