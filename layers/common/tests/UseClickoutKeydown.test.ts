import { describe, it, expect, vi, afterEach } from 'vitest';
import { ref } from 'vue';
import { onClickOutside, onKeyDown } from '@vueuse/core';
import { useClickoutKeydown } from '../composables/UseClickoutKeydown';

vi.mock('@vueuse/core', () => ({
  onClickOutside: vi.fn((eleRef, handler) => {
    const callback = (evt: MouseEvent) => handler(evt);
    document.addEventListener('click', callback);
    return () => document.removeEventListener('click', callback);
  }),
  onKeyDown: vi.fn((keys, handler) => {
    const callback = (evt: KeyboardEvent) => handler(evt);
    document.addEventListener('keydown', callback);
    return () => document.removeEventListener('keydown', callback);
  }),
}));

describe('useClickoutKeydown', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should activate and listen for click outside events', () => {
    const handler = vi.fn();
    const eleRef = ref(document.createElement('div'));
    const { active, inactive } = useClickoutKeydown(eleRef, 'Escape', handler);

    active();

    // Simulate click outside
    const event = new MouseEvent('click', { bubbles: true });
    document.dispatchEvent(event);

    expect(onClickOutside).toHaveBeenCalledWith(eleRef, expect.any(Function));
    expect(handler).toHaveBeenCalledWith(event);

    inactive();

    // Simulate click after inactive
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1); // No additional calls
  });

  it('should activate and listen for keydown events', () => {
    const handler = vi.fn();
    const eleRef = ref(document.createElement('div'));
    const { active, inactive } = useClickoutKeydown(eleRef, 'Escape', handler);

    active();

    // Simulate keydown
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(onKeyDown).toHaveBeenCalledWith('Escape', expect.any(Function));
    expect(handler).toHaveBeenCalledWith(event);

    inactive();

    // Simulate keydown after inactive
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(handler).toHaveBeenCalledTimes(1); // No additional calls
  });

  it('should force rebind listeners when active is called with force=true', () => {
    const handler = vi.fn();
    const eleRef = ref(document.createElement('div'));
    const { active } = useClickoutKeydown(eleRef, 'Escape', handler);

    active();
    active(true); // Force rebinding

    expect(onClickOutside).toHaveBeenCalledTimes(2);
    expect(onKeyDown).toHaveBeenCalledTimes(2);
  });
});
