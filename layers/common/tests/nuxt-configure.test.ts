import { describe, it, expect, beforeEach, vi } from 'vitest';
import { nuxtApiRoutePath, nuxtApiProxyRule, nuxtCompatibilityDate } from '../configures/nuxt-config-helper';

describe('nuxtCompatibilityDate', () => {
  it('should be set to "2024-10-23"', () => {
    expect(nuxtCompatibilityDate).toBe('2024-10-23');
  });
});

describe('nuxtApiRoutePath', () => {
  beforeEach(() => {
    vi.resetModules(); // Reset environment variables between tests
  });

  it('should return the default API route when envFirst is false', () => {
    expect(nuxtApiRoutePath(false)).toBe('/api/v1');
  });

  it('should return the default API route when envFirst is true and NUXT_PUBLIC_API_ROUTE is not set', () => {
    expect(nuxtApiRoutePath(true)).toBe('/api/v1');
  });

  it('should return the value of NUXT_PUBLIC_API_ROUTE when envFirst is true and NUXT_PUBLIC_API_ROUTE is set', () => {
    process.env.NUXT_PUBLIC_API_ROUTE = '/custom/api';
    expect(nuxtApiRoutePath(true)).toBe('/custom/api');
  });
});

describe('nuxtApiProxyRule', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should return an empty object when NUXT_PUBLIC_API_PROXY is not set', () => {
    expect(nuxtApiProxyRule()).toEqual({});
  });

  it('should return a proxy rule with default postfix when NUXT_PUBLIC_API_PROXY is set', () => {
    process.env.NUXT_PUBLIC_API_PROXY = 'http://localhost:8080/api/v1';
    process.env.NUXT_PUBLIC_API_ROUTE = '/api/v1';
    expect(nuxtApiProxyRule()).toEqual({ '/api/v1/**': { proxy: 'http://localhost:8080/api/v1' } });
  });

  it('should return a proxy rule with custom postfix when NUXT_PUBLIC_API_PROXY is set', () => {
    process.env.NUXT_PUBLIC_API_PROXY = 'http://localhost:8080/api/v1';
    process.env.NUXT_PUBLIC_API_ROUTE = '/api/v1';
    expect(nuxtApiProxyRule('/custom')).toEqual({ '/api/v1/custom': { proxy: 'http://localhost:8080/api/v1' } });
  });
});
