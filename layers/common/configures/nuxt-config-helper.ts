export const nuxtCompatibilityDate = '2024-10-23';

/**
 * NOTE: use useRuntimeConfig().public.apiRoute outside of nuxt.config.ts
 *
 * return ApiRoutePath if envFirst and process.env.NUXT_PUBLIC_API_ROUTE,
 * otherwise '/api/v1'
 */
export function nuxtPublicApiRoute(envFirst = false): string {
  if (envFirst) {
    const v = process.env.NUXT_PUBLIC_API_ROUTE;
    if (v) return v;
  }
  return '/api/v1';
}

/**
 * set Api proxy via `.env`, e.g. the following line,
 *
 * ```
 * NUXT_PUBLIC_API_ROUTE=/api/v1
 * NUXT_PUBLIC_DEV_PROXY=http://localhost:8080/api/v1/
 * ```
 *
 * will proxy all `/api/v1/a/b/c.json` requests
 * to `http://localhost:8080/api/v1/a/b/c.json`
 *
 * @see https://nitro.build/config#devproxy
 * @see https://github.com/unjs/httpxy
 */
export function nuxtPublicDevProxy() {
  const rv = process.env.NUXT_PUBLIC_DEV_PROXY;
  return rv
    ? { [nuxtPublicApiRoute(true)]: {
        target: rv,
        changeOrigin: true,
      },
      }
    : {};
}
