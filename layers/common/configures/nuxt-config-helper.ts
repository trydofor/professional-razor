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

export const nuxtI18nEnUs = {
  code: 'en-US',
  name: 'English',
  file: 'en-US.ts',
  language: 'en-US', // https://i18n.nuxtjs.org/docs/guide/seo
};

export const nuxtI18nZhCn = {
  code: 'zh-CN',
  name: '简体中文',
  file: 'zh-CN.ts',
  language: 'zh-CN',
};

/**
 * locales need to be set for every layer (project included) providing locale files.
 *
 * ```
 * // any nuxt i18n config need i18n.locales
 * export default defineNuxtConfig({
 *  i18n: {
 *    locales: nuxtI18nLocales,
 *  },
 * }
 * // and need /i18n/locales/en-US.ts
 * // dynamic import message
 * import { en as $vuetify } from 'vuetify/locale';
 * export default () => ({
 *   $vuetify,
 * });
 * // or static message
 * export default {
 *   error: {}
 * };
```
 *
 * @see https://i18n.nuxtjs.org/docs/guide/layers#merging-locales
 */
export const nuxtI18nLocales = [nuxtI18nEnUs, nuxtI18nZhCn];
