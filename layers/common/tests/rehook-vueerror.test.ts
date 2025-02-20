import { describe, it, expect } from 'vitest';

describe('rehook-vue-error-plugin', async () => {
  it('should have _hooks property in nuxtApp.hooks', () => {
    const nuxtApp = useNuxtApp();
    expect(nuxtApp.hooks).toBeDefined();
    expect((nuxtApp.hooks as SafeAny)._hooks).toBeDefined();
  });

  it('should not throw an error when app:created hook is triggered', async () => {
    const nuxtApp = useNuxtApp();
    await expect(nuxtApp.callHook('app:created', nuxtApp.vueApp)).resolves.not.toThrow();
  });

  it('should register vue:error hook correctly', async () => {
    const nuxtApp = useNuxtApp();
    await nuxtApp.callHook('app:created', nuxtApp.vueApp);
    expect((nuxtApp.hooks as SafeAny)._hooks['vue:error']).toBeInstanceOf(Array);
    expect((nuxtApp.hooks as SafeAny)._hooks['vue:error'].length).toBe(1);
    logger.log((nuxtApp.hooks as SafeAny)._hooks['vue:error']);
  });
});
