import { describe, it, expect } from 'vitest';
import type { InjectionKey } from 'vue';

describe('globalProvide and globalInject', () => {
  const testKey: InjectionKey<string> = Symbol('test-key');
  const anotherKey: InjectionKey<number> = Symbol('another-key');

  it('provides and injects a value', () => {
    const value = 'hello';
    globalProvide(testKey, value);

    const injected = globalInject(testKey);
    expect(injected).toBe(value);
  });

  it('returns old value when overwriting with force', () => {
    const firstValue = 'first';
    const secondValue = 'second';
    globalProvide(testKey, undefined);
    globalProvide(testKey, firstValue);
    const oldValue = globalProvide(testKey, secondValue, true);

    expect(oldValue).toBe(firstValue);
    const injected = globalInject(testKey);
    expect(injected).toBe(secondValue);
  });

  it('removes a value when provided with undefined', () => {
    globalProvide(anotherKey, 123);
    expect(globalInject(anotherKey)).toBe(123);

    globalProvide(anotherKey, undefined);
    expect(() => globalInject(anotherKey)).toThrowError(/no provided value/);
  });

  it('throws error if no value is found', () => {
    const missingKey: InjectionKey<boolean> = Symbol('missing-key');
    expect(() => globalInject(missingKey)).toThrowError(/no provided value/);
  });
});
