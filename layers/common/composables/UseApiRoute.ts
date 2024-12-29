import { useEventBus, type EventBusKey } from '@vueuse/core';
import { FetchError } from 'ofetch';

// import type { FetchOptions } from 'ofetch';
type ApiRouteOptions = NonNullable<Parameters<typeof $fetch>[1]>;

export type ApiRouteAuthEvent = {
  status: number;
  session?: string;
  headers?: Record<string, string>;
};

/**
 * https://github.com/unjs/ofetch/blob/main/src/fetch.ts
 * handle the event and return
 *  - null - nop
 *  - non-null - to set the response._data, options.ignoreResponseError=true
 *  - FetchError - to set context.error, get it from error.cause
 */
export type ApiRouteAuthHandle = (event: ApiRouteAuthEvent) => SafeAny | FetchError;

export const apiRouteAuthEventKey: EventBusKey<ApiRouteAuthEvent> = Symbol('apiRouteResponseEventKey');
export const apiRouteAuthEventBus = useEventBus(apiRouteAuthEventKey);

/**
 * emit event by apiRouteAuthEventBus, handle 401 to return `{success:false}`
 */
export const apiRouteAuthEmitter: ApiRouteAuthHandle = (evt) => {
  apiRouteAuthEventBus.emit(evt);
  return evt.status === 401 ? { success: false } : null;
};
/**
 * construct a onResponse by eventBus and listen status or header
 * @param statusOrHeader status or header(case insensitive), `[401]` as default.
 * @param handler the event bus, `apiRouteAuthEmitter` as default.
 */
export function apiRouteAuthOptions(statusOrHeader: (number | string)[] = [401], handler: ApiRouteAuthHandle = apiRouteAuthEmitter): ApiRouteOptions {
  const status: number[] = [];
  const header: string[] = [];
  for (const k of statusOrHeader) {
    if (typeof k === 'string') {
      header.push(k);
    }
    else {
      status.push(k);
    }
  }

  return {
    onResponse: (ctx) => {
      const evt: ApiRouteAuthEvent = { status: ctx.response.status };
      const hds = ctx.response.headers;

      const sn = hds.get('session');
      if (sn) evt.session = sn;

      for (const h of header) {
        const hv = hds.get(h);
        if (hv) {
          if (evt.headers == null) evt.headers = {};
          evt.headers[h] = hv;
        }
      }

      if (status.includes(evt.status) || evt.session != null || evt.headers != null) {
        const rst = handler(evt);
        if (rst instanceof FetchError) {
          ctx.error = rst;
        }
        else if (rst != null) {
          ctx.options.ignoreResponseError = true;
          ctx.response._data = rst;
        }
      }
    },
  };
}

export function apiRouteFetchError(err: SafeAny): FetchError | null {
  return err instanceof FetchError ? err : null;
}

/**
 * Provides utility functions for interacting with an API, including URL generation,
 * options merging, and HTTP request methods.
 *
 * @param ops - Default fetch options to be merged with each request's specific options.
 * @returns An object containing utility functions for API requests.
 * @see https://github.com/unjs/ofetch
 */
export function useApiRoute(ops?: ApiRouteOptions) {
  const prefix = useRuntimeConfig().public.apiRoute;

  /**
   * Constructs the full URL by appending the given URI to the API route prefix.
   *
   * @param uri - The URI to append to the prefix.
   * @returns The full URL string.
   */
  function url(uri: string) {
    return prefix + uri;
  }

  /**
   * Merges the default fetch options with the given options.
   * the default Behavior is replaced, but the following are merged to array,
   * - onRequest, onRequestError
   * - onResponse, onResponseError
   *
   * @param op - Specific fetch options for a request.
   * @returns A merged object containing the combined options.
   */
  function opt(op?: ApiRouteOptions): ApiRouteOptions {
    if (ops == null) return op == null ? {} : op;

    const opt = { ...ops, ...op };

    opt.onRequest = flatArray(ops.onRequest, op?.onRequest);
    opt.onRequestError = flatArray(ops.onRequestError, op?.onRequestError);
    opt.onResponse = flatArray(ops.onResponse, op?.onResponse);
    opt.onResponseError = flatArray(ops.onResponseError, op?.onResponseError);

    return opt;
  }

  /**
   * Sends a fetch request to the given URI with the specified options.
   *
   * @template T - The expected type of the data returned by the API.
   * @param uri - The endpoint URI to request.
   * @param op - Fetch options for the request.
   * @returns A promise resolving to the API's response as a `DataResult<T>`.
   */
  function req<T>(uri: string, op: ApiRouteOptions) {
    return $fetch<DataResult<T>>(url(uri), opt(op));
  }

  /**
   * Sends a fetch request to the given URI with the specified options and get raw response.
   *
   * @template T - The expected type of the data returned by the API.
   * @param uri - The endpoint URI to request.
   * @param op - Fetch options for the request.
   * @returns A promise resolving to the API's response as a `DataResult<T>`.
   */
  function raw<T>(uri: string, op: ApiRouteOptions) {
    return $fetch.raw<DataResult<T>>(url(uri), opt(op));
  }

  /**
   * Sends a GET request to the specified URI with optional query parameters and fetch options.
   *
   * @template T - The expected type of the data returned by the API.
   * @param uri - The endpoint URI to request.
   * @param query - Optional query parameters to include in the request.
   * @param op - Optional fetch options to customize the request.
   * @returns A promise resolving to the API's response as a `DataResult<T>`.
   */
  function get<T>(uri: string, query?: SafeObj, op?: ApiRouteOptions) {
    return req<T>(uri, {
      ...op,
      method: 'get',
      query,
    });
  }

  /**
   * Sends a POST request to the specified URI with optional body, query parameters, and fetch options.
   *
   * @template T - The expected type of the data returned by the API.
   * @param uri - The endpoint URI to request.
   * @param body - Optional request body, which can be an object, URLSearchParams, or FormData.
   * @param query - Optional query parameters to include in the request.
   * @param op - Optional fetch options to customize the request.
   * @returns A promise resolving to the API's response as a `DataResult<T>`.
   */
  function post<T>(uri: string, body?: SafeObj | URLSearchParams | FormData, query?: SafeObj, op?: ApiRouteOptions) {
    return req<T>(uri, {
      ...op,
      method: 'post',
      query,
      body,
    });
  }

  return {
    url,
    opt,
    req,
    raw,
    get,
    post,
  };
}
