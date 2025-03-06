import { describe, it, expect, beforeEach, vi } from 'vitest';
import { nuxtPublicApiRoute, nuxtPublicDevProxy, nuxtCompatibilityDate } from '../configures/nuxt-config-helper';

describe('nuxtCompatibilityDate', () => {
  it('should be set to "2024-10-23"', () => {
    expect(nuxtCompatibilityDate).toBe('2024-10-23');
  });
});

describe('nuxtPublicApiRoute', () => {
  beforeEach(() => {
    vi.resetModules(); // Reset environment variables between tests
  });

  it('should return the default API route when envFirst is false', () => {
    expect(nuxtPublicApiRoute(false)).toBe('/api/v1');
  });

  it('should return the default API route when envFirst is true and NUXT_PUBLIC_API_ROUTE is not set', () => {
    expect(nuxtPublicApiRoute(true)).toBe('/api/v1');
  });

  it('should return the value of NUXT_PUBLIC_API_ROUTE when envFirst is true and NUXT_PUBLIC_API_ROUTE is set', () => {
    process.env.NUXT_PUBLIC_API_ROUTE = '/custom/api';
    expect(nuxtPublicApiRoute(true)).toBe('/custom/api');
  });
});

describe('nuxtPublicDevProxy', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should return an empty object when NUXT_PUBLIC_DEV_PROXY is not set', () => {
    expect(nuxtPublicDevProxy()).toEqual({});
  });

  it('should return a proxy rule with default postfix when NUXT_PUBLIC_DEV_PROXY is set', () => {
    process.env.NUXT_PUBLIC_DEV_PROXY = 'http://localhost:8080/api/v1';
    process.env.NUXT_PUBLIC_API_ROUTE = '/api/v1';
    expect(nuxtPublicDevProxy()).toEqual({ '/api/v1': { target: 'http://localhost:8080/api/v1', changeOrigin: true } });
  });
});
