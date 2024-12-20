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
    get: <Data>(uri: string, query?: SafeObj) => $fetch<DataResult<Data>>(
      prefix + uri,
      {
        method: 'get',
        query,
      }),
    post: <Data>(uri: string, body?: SafeObj | URLSearchParams | FormData, query?: SafeObj) => $fetch<DataResult<Data>>(
      prefix + uri,
      {
        method: 'post',
        query,
        body,
      }),
  };
}
