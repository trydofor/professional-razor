import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, provide } from 'vue';

describe('useThrownCapturer', () => {
  it('should create a new ThrownCapturer instance when asProvider is true', () => {
    let injectedInstance;

    const TestComponent = defineComponent({
      setup() {
        injectedInstance = useThrownCapturer(UseCapturerType.Provider);
        return () => null;
      },
    });

    mount(TestComponent);

    expect(injectedInstance).toBeDefined();
    expect(injectedInstance).not.toBe(globalThrownCapturer);
  });

  it('should use the injected ThrownCapturer instance when asProvider is false', () => {
    const injectedInstance = new ThrownCapturer();

    const Parent = defineComponent({
      setup(_, { slots }) {
        provide(ThrownCapturerInjectKey, injectedInstance);
        return () => slots.default?.();
      },
    });

    const Child = defineComponent({
      setup() {
        const instance = useThrownCapturer(UseCapturerType.Injected);
        return { instance };
      },
    });

    const wrapper = mount(Parent, {
      slots: { default: Child },
    });

    expect(wrapper.findComponent(Child).vm.instance).toBe(injectedInstance);
  });

  it('should fallback to globalThrownCapturer when no provider exists', () => {
    const wrapper = mount(defineComponent({
      setup() {
        const instance = useThrownCapturer(UseCapturerType.Injected);
        return { instance };
      },
      template: '<div></div>',
    }));

    expect(wrapper.vm.instance).toBe(globalThrownCapturer);
  });
});
