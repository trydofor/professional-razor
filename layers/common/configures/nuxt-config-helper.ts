export const nuxtCompatibilityDate = '2024-10-23';

/**
 * NOTE: use useRuntimeConfig().public.apiRoute outside of nuxt.config.ts
 *
 * return ApiRoutePath if envFirst and process.env.NUXT_PUBLIC_API_ROUTE,
 * otherwise '/api/v1'
 */
export function nuxtApiRoutePath(envFirst = false) {
  if (envFirst) {
    const v = process.env.NUXT_PUBLIC_API_ROUTE;
    if (v) return v;
  }
  return '/api/v1';
}

/**
 * NOTE: use useRuntimeConfig().public.apiRoute outside of nuxt.config.ts
 *
 * set Api proxy via `.env`, e.g. the following line,
 *
 * ```
 * NUXT_PUBLIC_API_ROUTE=/api/v1
 * NUXT_PUBLIC_API_PROXY=http://localhost:8080/api/v1/**
 * ```
 *
 * will proxy all `/api/v1/a/b/c.json` requests
 * to `http://localhost:8080/api/v1/a/b/c.json`
 *
 * and the `**` is wildcard and placeholder
 *
 * @see https://nuxt.com/docs/api/nuxt-config#routerules-1
 */
export function nuxtApiProxyRule(postfix = '/**') {
  const rv = process.env.NUXT_PUBLIC_API_PROXY;
  return rv ? { [nuxtApiRoutePath(true) + postfix]: { proxy: rv } } : {};
}
