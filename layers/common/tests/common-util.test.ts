import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

describe('common-util helpers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('jsonReplacer normalizes bigint, Map and Set', () => {
    expect(jsonReplacer('key', BigInt(10))).toBe('10');
    expect(jsonReplacer('key', new Map([['a', 1]]))).toEqual({ a: 1 });
    expect(jsonReplacer('key', new Set([1, 2]))).toEqual([1, 2]);
    expect(jsonReplacer('key', 'value')).toBe('value');
  });

  it('attachId adds id while preserving reference', () => {
    const obj = { foo: 'bar' };
    const attached = attachId('token', obj);
    expect(attached).toBe(obj);
    expect(attached.id).toBe('token');
  });

  it('flattens arrays and items correctly', () => {
    expect(flatArray([1, [2, null], undefined, 3])).toEqual([1, 2, 3]);
    expect(flatItems([1, [2, 3]])).toEqual([1, 2, 3]);
    expect(flatItems([undefined, 5])).toBe(5);
    expect(flatItems(undefined)).toBeUndefined();
  });

  it('wrapMacroTaskFunction runs in next tick', () => {
    const spy = vi.fn();
    const wrapped = wrapMacroTaskFunction(spy, 50);
    wrapped('a');
    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(50);
    expect(spy).toHaveBeenCalledWith('a');
  });

  it('wrapMacroTaskPromise resolves with function result', async () => {
    const spy = vi.fn(() => 'done');
    const wrapped = wrapMacroTaskPromise(spy, 25);
    const promise = wrapped();
    vi.advanceTimersByTime(25);
    await expect(promise).resolves.toBe('done');
    expect(spy).toHaveBeenCalled();
  });

  it('lazyNonnull enforces initialization semantics', () => {
    const lazy = lazyNonnull<number>();
    expect(() => lazy.value).toThrow('lazy value is not initialized');
    lazy.value = 42;
    expect(lazy.value).toBe(42);
    expect(lazy.default).toBeUndefined();
    expect(lazy.absent).toBe(false);
  });

  it('refToFunction handles refs and functions', () => {
    expect(refToFunction()).toBe(DummyFunction);

    const fn = vi.fn();
    expect(refToFunction(fn)).toBe(fn);

    const target = ref<number | undefined>();
    const setter = refToFunction(target);
    setter(123);
    expect(target.value).toBe(123);
  });
});
