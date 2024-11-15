/**
 * A helper for handling API fetch with apiRoute prefix.
 *
 * @returns {Object} The API helper.
 * @returns {Function} `url(uri: string): string` - the url apiRoute prefix.
 * @returns {Function} `get<Data>(uri: string): Promise<DataResult<Data>>` - GET request with apiRoute prefix
 * @returns {Function} `post<Data>(uri: string): Promise<DataResult<Data>>` - POST request with apiRoute prefix
 */
export function useApiRoute() {
  const prefix = useRuntimeConfig().public.apiRoute;
  return {
    url: (uri: string) => prefix + uri,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get: <Data>(uri: string, query?: Record<string, any>) => $fetch<DataResult<Data>>(
      prefix + uri,
      {
        method: 'get',
        query,
      }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post: <Data>(uri: string, body?: Record<string, any> | URLSearchParams | FormData, query?: Record<string, any>) => $fetch<DataResult<Data>>(
      prefix + uri,
      {
        method: 'post',
        query,
        body,
      }),
  };
}
