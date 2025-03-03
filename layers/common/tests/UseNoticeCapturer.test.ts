import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, provide } from 'vue';

describe('useNoticeCapturer', () => {
  it('should create a new NoticeCapturer instance when asProvider is true', () => {
    let injectedInstance;

    const TestComponent = defineComponent({
      setup() {
        injectedInstance = useNoticeCapturer(UseCapturerType.Provider);
        return () => null;
      },
    });

    mount(TestComponent);

    expect(injectedInstance).toBeDefined();
    expect(injectedInstance).not.toBe(globalNoticeCapturer);
  });

  it('should use the injected NoticeCapturer instance when asProvider is false', () => {
    const injectedInstance = new NoticeCapturer();

    const Parent = defineComponent({
      setup(_, { slots }) {
        provide(NoticeCapturerInjectKey, injectedInstance);
        return () => slots.default?.();
      },
    });

    const Child = defineComponent({
      setup() {
        const instance = useNoticeCapturer(UseCapturerType.Injected);
        return { instance };
      },
    });

    const wrapper = mount(Parent, {
      slots: { default: Child },
    });

    expect(wrapper.findComponent(Child).vm.instance).toBe(injectedInstance);
  });

  it('should fallback to globalNoticeCapturer when no provider exists', () => {
    const wrapper = mount(defineComponent({
      setup() {
        const instance = useNoticeCapturer(UseCapturerType.Injected);
        return { instance };
      },
      template: '<div></div>',
    }));

    expect(wrapper.vm.instance).toBe(globalNoticeCapturer);
  });
});
