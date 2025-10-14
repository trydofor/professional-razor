import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';

const UniqueComponent = defineComponent({
  setup(_props, { expose }) {
    const unique = useUniqueKey();
    expose({ unique });
    return () => h('div');
  },
});

describe('useUniqueKey', () => {
  it('generates deterministic keys based on component uid and md5 hash', () => {
    const wrapper = mount(UniqueComponent);
    const unique = (wrapper.vm as unknown as { unique: (...args: unknown[]) => string }).unique;

    const key = unique('foo', 123, { nested: true });
    const uid = (wrapper.vm as SafeAny).$?.uid ?? wrapper.vm.$.uid;
    expect(key.startsWith(`${uid}-`)).toBe(true);

    // same args produce identical hash, different args produce different hash
    expect(unique('foo', 123, { nested: true })).toBe(key);
    expect(unique('foo', 456)).not.toBe(key);
  });

  it('throws when used outside of component setup', () => {
    expect(() => useUniqueKey()).toThrowError('useUniqueKey must be used within a Vue component setup');
  });
});
