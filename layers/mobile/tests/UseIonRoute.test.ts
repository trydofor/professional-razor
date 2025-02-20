import { describe, it, expect } from 'vitest';
import type { Router } from 'vue-router';
import { createRouter, createMemoryHistory } from 'vue-router';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';

function setupTestRouter(): Router {
  const routes = [
    { path: '/test/:id', name: 'TestRoute', component: defineComponent({
      setup() {
        return () => h('div');
      },
    }) },
  ];
  return createRouter({
    history: createMemoryHistory(),
    routes,
  });
}

describe('useRoute and useIonRoute', () => {
  it('should return empty objects for query and params with default useRoute in Nuxt', async () => {
    // Mock Nuxt useRoute in a simple setup
    const route = useRoute();

    expect(route.query).toEqual({});
    expect(route.params).toEqual({});
  });

  it('should correctly fetch params and query with useIonRoute', async () => {
    // Create a router instance
    const router = setupTestRouter();
    router.push({ path: '/test/123', query: { name: 'test' } });
    await router.isReady();

    // Mount a test component to provide router context
    const TestComponent = defineComponent({
      setup() {
        const routeVue = useIonRoute();
        const routeNuxt = useRoute();
        return () => h('div', {}, `
          routeVue.params:${JSON.stringify(routeVue.params)},
          routeVue.query:${JSON.stringify(routeVue.query)},
          routeNuxt.params:${JSON.stringify(routeNuxt.params)},
          routeNuxt.query:${JSON.stringify(routeNuxt.query)},
        `);
      },
    });

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [router],
      },
    });

    // Assert params and query
    const text = wrapper.text();
    expect(text).toContain('routeVue.params:{"id":"123"}');
    expect(text).toContain('routeVue.query:{"name":"test"}');
    expect(text, 'https://github.com/trydofor/professional-razor/issues/104').toContain('routeNuxt.params:{}');
    expect(text, 'https://github.com/trydofor/professional-razor/issues/104').toContain('routeNuxt.query:{}');
  });
});
