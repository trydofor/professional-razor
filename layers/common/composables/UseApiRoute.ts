import { useEventBus, type EventBusKey } from '@vueuse/core';
import type { FetchContext } from 'ofetch';
import { FetchError, createFetchError } from 'ofetch';

// import type { FetchOptions } from 'ofetch'; // ng for $fetch
type ApiFetchOptions = NonNullable<Parameters<typeof $fetch>[1]>;
type UnMaybeArray<T> = Exclude<T, T[]>;

export type ApiResponseContext = Required<Pick<FetchContext, 'response'>> & Omit<FetchContext, 'response'>;
export type ApiRequestHook = UnMaybeArray<NonNullable<ApiFetchOptions['onRequest']>>;
export type ApiResponseHook = UnMaybeArray<NonNullable<ApiFetchOptions['onResponse']>>;

export type ApiResponseEvent = { session?: string; context: ApiResponseContext };
export const apiResponseEventKey: EventBusKey<ApiResponseEvent> = Symbol('apiResponseEventKey');
export const apiResponseEventBus = useEventBus<ApiResponseEvent, undefined>(apiResponseEventKey);

/**
 * * ✅ the browser's fetch automatically infers the Content-Type.
 * * ❌ Node.js $fetch may not automatically set the Content-Type.
 * * URLSearchParams - application/x-www-form-urlencoded
 * * FormData - multipart/form-data
 * * default - application/json
 */
export const apiRequestContentTypeHook: ApiRequestHook = (context) => {
  const body = context.options.body;
  const headers = context.options.headers;
  if (headers.has('content-type')) return;

  if (body instanceof URLSearchParams) {
    headers.set('content-type', 'application/x-www-form-urlencoded');
  }
  else if (body instanceof FormData) {
    headers.set('content-type', 'multipart/form-data');
  }
  else {
    headers.set('content-type', 'application/json');
  }
};

/**
 * emit ApiResponseEvent by apiResponseEventBus if get value by header
 *
 * @param sessionHeader the header of response that holds session token, default 'session'
 */
export function apiResponseSessionHook(sessionHeader: string[] = ['session'], eventKey: EventBusKey<ApiResponseEvent> = apiResponseEventKey): ApiResponseHook {
  const eventBus = useEventBus(eventKey);
  return (context) => {
    const headers = context.response.headers;
    for (const hd of sessionHeader) {
      const session = headers.get(hd);
      if (session) {
        eventBus.emit({ session, context });
        break;
      }
    }
  };
}

/**
 * throw FetchError if response.status not in status
 *
 * @param okStatus the success response code
 */
export function apiResponseStatusHook(okStatus: number[] = [200]): ApiResponseHook {
  return (context) => {
    if (!okStatus.includes(context.response.status)) {
      throw createFetchError(context);
    }
  };
}

/**
 * throw ApiResultError if not result.success
 *
 * @param apiFalse include the false
 */
export function apiResponseResultHook(apiFalse: boolean = true): ApiResponseHook {
  return (context) => {
    const result = context.response._data as ApiResult;
    if (result != null && result.success === false) {
      if (apiFalse || 'errors' in result) {
        throw new ApiResultError(result);
      }
    }
  };
}

export function apiRouteFetchError(err: SafeAny): FetchError | undefined {
  return err instanceof FetchError ? err : undefined;
}

/**
 * how to merge this fetchHook(passin) with the that fetchHook(default) ,
 * - true - all this, no that
 * - false - no this, all that
 * - undefined/null - both this and that, into array
 */
export type ApiHookMergeOptions = {
  mergeFetchHooks?: boolean | {
    onRequest?: boolean;
    onRequestError?: boolean;
    onResponse?: boolean;
    onResponseError?: boolean;
  };
};

export const defaultFetchOptions: ApiFetchOptions = {
  onRequest: typeof window === 'undefined' ? undefined : apiRequestContentTypeHook,
  onResponse: [
    apiResponseSessionHook(),
    apiResponseStatusHook(),
    apiResponseResultHook(),
  ],
};

/**
 * Provides utility functions for interacting with an API, including URL generation,
 * options merging, and HTTP request methods.
 *
 * @param options - Default fetch options to be merged with each request's specific options.
 * @returns An object containing utility functions for API requests.
 * @see https://github.com/unjs/ofetch
 */
export function useApiRoute(options: ApiFetchOptions = defaultFetchOptions) {
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
   * the default Behavior is replaced, but FetchHooks can merged into array,
   * - onRequest, onRequestError, onResponse, onResponseError
   *
   * @param op - Specific fetch options for a request.
   * @returns A merged object containing the combined options.
   */
  function opt(op?: ApiFetchOptions & ApiHookMergeOptions): ApiFetchOptions {
    if (op == null) return { ...options };
    const opt = { ...options, ...op };
    delete opt.mergeFetchHooks;
    if (options == null) return opt;

    const mergeHooks = op?.mergeFetchHooks;
    if (mergeHooks == null) { // default into array
      // user first, defaults last
      opt.onRequest = flatItems([op.onRequest, options.onRequest]);
      opt.onRequestError = flatItems([op.onRequestError, options.onRequestError]);
      opt.onResponse = flatItems([op.onResponse, options.onResponse]);
      opt.onResponseError = flatItems([op.onResponseError, options.onResponseError]);
      return opt;
    }
    else if (typeof mergeHooks === 'boolean') { // all this, no that
      opt.onRequest = mergeHooks ? op.onRequest : options.onRequest;
      opt.onRequestError = mergeHooks ? op.onRequestError : options.onRequestError;
      opt.onResponse = mergeHooks ? op.onResponse : options.onResponse;
      opt.onResponseError = mergeHooks ? op.onResponseError : options.onResponseError;
    }
    else {
      const merge = (mo: boolean | undefined, tz: SafeAny, tt: SafeAny): SafeAny => {
        if (mo === true) return tz;
        if (mo === false) return tt;
        return flatItems([tz, tt]);
      };
      opt.onRequest = merge(mergeHooks.onRequest, op.onRequest, options.onRequest);
      opt.onRequestError = merge(mergeHooks.onRequestError, op.onRequestError, options.onRequestError);
      opt.onResponse = merge(mergeHooks.onResponse, op.onResponse, options.onResponse);
      opt.onResponseError = merge(mergeHooks.onResponseError, op.onResponseError, options.onResponseError);
    }

    return opt;
  }

  /**
   * request to the given URI with the specified options.
   *
   * @param uri - The endpoint URI to request.
   * @param op - Fetch options for the request.
   * @returns A promise of response, default as `T<D> = ApiResult<any>`.
   */
  function req<D = SafeAny, T = ApiResult<D>>(uri: string, op: ApiFetchOptions & ApiHookMergeOptions) {
    return $fetch<T>(url(uri), opt(op));
  }

  /**
   * request to the given URI with the specified options and get raw response.
   *
   * @param uri - The endpoint URI to request.
   * @param op - Fetch options for the request.
   * @returns A promise of response, default as `T<D> = ApiResult<any>`.
   */
  function raw<D = SafeAny, T = ApiResult<D>>(uri: string, op: ApiFetchOptions & ApiHookMergeOptions) {
    return $fetch.raw<T>(url(uri), opt(op));
  }

  /**
   * Sends a GET request to the specified URI with optional query parameters and fetch options.
   *
   * @param uri - The endpoint URI to request.
   * @param query - Optional query parameters to include in the request.
   * @param op - Optional fetch options to customize the request.
   * @returns A promise of response, default as `T<D> = DataResult<any>`.
   */
  function get<D = SafeAny, T = DataResult<D>>(uri: string, query?: SafeObj, op?: ApiFetchOptions & ApiHookMergeOptions) {
    return req<D, T>(uri, {
      ...op,
      method: 'get',
      query,
    });
  }

  /**
   * Sends a POST request to the specified URI with optional body, query parameters, and fetch options.
   *
   * @param uri - The endpoint URI to request.
   * @param body - Optional request body, which can be an object, URLSearchParams, or FormData.
   * @param query - Optional query parameters to include in the request.
   * @param op - Optional fetch options to customize the request.
   * @returns A promise of response, default as `T<D> = DataResult<any>`.
   */
  function post<D = SafeAny, T = DataResult<D>>(uri: string, body?: SafeObj | URLSearchParams | FormData, query?: SafeObj, op?: ApiFetchOptions & ApiHookMergeOptions) {
    return req<D, T>(uri, {
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
