import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import { createI18n } from 'vue-i18n';
import { mount } from '@vue/test-utils';

describe('useLocalizeMessage', () => {
  it('localizes message using vue-i18n context', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'en-US',
      messages: {
        'en-US': {
          greet: 'Hello {0}',
          world: 'World',
        },
      },
    });

    const TestComponent = defineComponent({
      setup(_props, { expose }) {
        const localize = useLocalizeMessage();
        expose({ localize });
        return () => null;
      },
    });

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [i18n],
      },
    });

    const localize = (wrapper.vm as unknown as { localize: ReturnType<typeof useLocalizeMessage> }).localize;
    const result = localize({ i18nCode: 'greet', i18nArgs: ['world'], message: 'fallback' }, true);

    expect(result).toBe('Hello World');
  });

  it('returns fallback when translation code missing', () => {
    const i18n = createI18n({ legacy: false, locale: 'en-US', messages: { 'en-US': {} } });

    const TestComponent = defineComponent({
      setup(_props, { expose }) {
        const localize = useLocalizeMessage();
        expose({ localize });
        return () => null;
      },
    });

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [i18n],
      },
    });

    const localize = (wrapper.vm as unknown as { localize: ReturnType<typeof useLocalizeMessage> }).localize;
    expect(localize(undefined, 'default')).toBe('default');
  });
});
