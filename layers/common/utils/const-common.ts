/**
 * set Api proxy via `.env`, e.g. the following line,
 *
 * `API_PROXY=http://localhost:8080/api/v1/**`
 *
 * will proxy all `/api/v1/a/b/c.json` requests
 * to `http://localhost:8080/api/v1/a/b/c.json`
 *
 * and the `**` is wildcard and placeholder
 *
 * @see https://nuxt.com/docs/api/nuxt-config#routerules-1
 */
export const ApiRoute = '/api/v1';
