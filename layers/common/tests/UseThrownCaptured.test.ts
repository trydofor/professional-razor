import { describe, it, expect, vi } from 'vitest';

describe('useThrownCaptured', () => {
  it('should add and delete hooks correctly', () => {
    const { putThrownHook, delThrownHook } = useThrownCaptured();

    const mockHook = vi.fn();
    putThrownHook('testHook', mockHook);

    expect(delThrownHook('testHook')).toBe(mockHook);
    expect(delThrownHook('testHook')).toBeUndefined();
  });

  it('should execute hooks and stop if returning boolean', () => {
    const { putThrownHook, callThrownHook } = useThrownCaptured();

    const hook1 = vi.fn(() => undefined);
    const hook2 = vi.fn(() => true);
    const hook3 = vi.fn(() => undefined);

    putThrownHook('hook1', hook1);
    putThrownHook('hook2', hook2);
    putThrownHook('hook3', hook3);

    expect(callThrownHook(new Error('test error'), null, 'test error')).toBe(true);
    expect(hook1).toHaveBeenCalled();
    expect(hook2).toHaveBeenCalled();
    expect(hook3).not.toHaveBeenCalled();
  });

  it('should return false if a hook explicitly returns false', () => {
    const { putThrownHook, callThrownHook } = useThrownCaptured();

    putThrownHook('hook1', () => false);
    putThrownHook('hook2', vi.fn());

    expect(callThrownHook(new Error('test error'), null, 'test error')).toBe(false);
  });

  it('should sort hooks correctly', () => {
    const { putThrownHook, sortThrownHook, withThrownHook } = useThrownCaptured();

    putThrownHook('b.hook', vi.fn());
    putThrownHook('a.hook', vi.fn());

    sortThrownHook((a, b) => a.localeCompare(b));

    withThrownHook((hooks) => {
      expect([...hooks.keys()]).toEqual(['100.ignoredThrownHook', 'a.hook', 'b.hook']);
    });
  });

  it('should handle withThrownHook callback correctly', () => {
    const { putThrownHook, withThrownHook } = useThrownCaptured();

    putThrownHook('hook1', vi.fn());
    putThrownHook('hook2', vi.fn());

    const hookCount = withThrownHook(hooks => hooks.size);
    expect(hookCount).toBe(3);
  });
});
