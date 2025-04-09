import type { EventBusKey } from '@vueuse/core';
import { useEventBus } from '@vueuse/core';
import type { FetchOptions, $Fetch, FetchContext } from 'ofetch';
// https://nuxt.com/docs/api/utils/dollarfetch
import { FetchError, createFetchError } from 'ofetch';

export type ApiRequestHook = NonArray<NonNullable<FetchOptions['onRequest']>>;
export type ApiResponseHook = NonArray<NonNullable<FetchOptions['onResponse']>>;

export type ApiResponseEvent = { status: number; session?: string };
export type ApiResponseContext = Required<Pick<FetchContext, 'response'>> & Omit<FetchContext, 'response'>;
export const apiResponseEventKey: EventBusKey<ApiResponseEvent> = Symbol('apiResponseEventKey');
export const apiResponseEventBus = useEventBus<ApiResponseEvent, ApiResponseContext>(apiResponseEventKey);

/**
 * ✅ browser fetch automatically infers the Content-Type.
 * ❌ Node.js $fetch may not automatically set the Content-Type.
 *
 * header Content-Type
 * * URLSearchParams - application/x-www-form-urlencoded
 * * FormData - multipart/form-data
 * * default - application/json
 *
 * header Accept
 * * default - application/json, text/html
 *
 * @see https://github.com/unjs/ofetch/blob/main/src/fetch.ts
 */
export function apiRequestAcceptContentHook(accept = 'application/json, text/html', id = 'requestAcceptContent'): ApiRequestHook & { id: string } {
  return attachId(id, (context) => {
    const body = context.options.body;
    const headers = context.options.headers;

    if (!headers.has('content-type')) {
      let contentType = 'application/json';
      if (body instanceof URLSearchParams) {
        contentType = 'application/x-www-form-urlencoded';
      }
      else if (body instanceof FormData) {
        contentType = 'multipart/form-data';
      }
      headers.set('content-type', contentType);
    }

    if (!context.options.headers.has('accept')) {
      context.options.headers.set('accept', accept);
    }
  });
};

/**
 * emit ApiResponseEvent by apiResponseEventBus if get value by header
 *
 * @param sessionHeader the header of response that holds session token, default 'session'
 */
export function apiResponseSessionHook(sessionHeader = ['session'], eventKey = apiResponseEventKey, id = 'responseSession'): ApiResponseHook & { id: string } {
  const eventBus = useEventBus(eventKey);
  return attachId(id, (context) => {
    const headers = context.response.headers;
    for (const hd of sessionHeader) {
      const session = headers.get(hd);
      if (session != null) {
        // empty means logout
        eventBus.emit({ status: context.response.status, session }, context);
        break;
      }
    }
  });
}

/**
 * if response.status is not in okStatus, throw before onResponseError hook,
 * (not handle by onResponseError), the thrown if options.ignoreResponseError,
 * * true - throw Ignored
 * * false - throw FetchError
 * default okStatus,
 * * 200 - OK
 * * 201 - Created
 * * 202 - Accepted
 * * 204 - No Content
 * * 206 - Partial Content
 *
 * @param okStatus default [200, 201, 202, 204, 206]
 */
export function apiResponseStatusHook(okStatus = [200, 201, 202, 204, 206], id = 'responseStatus'): ApiResponseHook & { id: string } {
  return attachId(id, (context) => {
    if (!okStatus.includes(context.response.status)) {
      if (context.options.ignoreResponseError === true) {
        throw Ignored;
      }
      else {
        throw createFetchError(context);
      }
    }
  });
}

/**
 * throw ApiResultError if not result.success
 * whether include the false result, default true
 */
export function apiResponseResultHook(includeFalse = true, id = 'responseResult'): ApiResponseHook & { id: string } {
  return attachId(id, (context) => {
    const result = context.response._data as ApiResult;
    if (result != null && result.success === false) {
      if (includeFalse || 'errors' in result) {
        throw newApiResultError(result);
      }
    }
  });
}

export function isFetchError(err: unknown): err is FetchError {
  return err instanceof FetchError;
}

export const defaultFetchHooks = {
  requestAcceptContent: apiRequestAcceptContentHook(),
  responseSession: apiResponseSessionHook(),
  responseStatus: apiResponseStatusHook(),
  responseResult: apiResponseResultHook(),
};

/**
 * how to merge this fetchHook(passin) with the that fetchHook(default) ,
 *
 * mergeFetchHooks merge hooks:
 * * true - all this, no that
 * * false - no this, all that
 * * undefined/null - both this and that, into array
 *
 * identifyFetchHooks to pick after merge:
 * * false - remove the hook  if exists
 * * true/undefined/null - NOP
 */
export type ApiHookMergeOptions = {
  mergeFetchHooks?: boolean | {
    onRequest?: boolean;
    onRequestError?: boolean;
    onResponse?: boolean;
    onResponseError?: boolean;
  };
  identifyFetchHooks?: Partial<Record<keyof typeof defaultFetchHooks, boolean>> & Record<string, boolean>;
};

export const defaultFetchOptions: FetchOptions = {
  onRequest: defaultFetchHooks.requestAcceptContent,
  onResponse: [
    defaultFetchHooks.responseSession,
    defaultFetchHooks.responseStatus,
    defaultFetchHooks.responseResult,
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
export function useApiRouteFetcher(options: FetchOptions = defaultFetchOptions) {
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
   * * onRequest
   * * onRequestError
   * * onResponse
   * * onResponseError
   *
   * @param op - Specific fetch options for a request.
   * @returns A merged object containing the combined options.
   */
  function opt(op?: FetchOptions & ApiHookMergeOptions): FetchOptions {
    if (op == null) return { ...options };

    const opt = { ...options, ...op };
    delete opt.mergeFetchHooks;
    delete opt.identifyFetchHooks;

    const mergeHooks = op?.mergeFetchHooks;
    if (mergeHooks == null) { // default into array
      // user first, defaults last
      opt.onRequest = flatItems([op.onRequest, options.onRequest]);
      opt.onRequestError = flatItems([op.onRequestError, options.onRequestError]);
      opt.onResponse = flatItems([op.onResponse, options.onResponse]);
      opt.onResponseError = flatItems([op.onResponseError, options.onResponseError]);
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

    if (op?.identifyFetchHooks != null) {
      const ids = op.identifyFetchHooks;
      const filter = (hooks: SafeAny): SafeAny => {
        if (hooks == null) return undefined;
        if (Array.isArray(hooks)) {
          return hooks.filter(hk => !(typeof hk.id === 'string' && ids[hk.id] === false));
        }
        else {
          return typeof hooks.id === 'string' && ids[hooks.id] === false ? undefined : hooks;
        }
      };

      opt.onRequest = filter(opt.onRequest);
      opt.onRequestError = filter(opt.onRequestError);
      opt.onResponse = filter(opt.onResponse);
      opt.onResponseError = filter(opt.onResponseError);
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
  function req<D = SafeAny, T = ApiResult<D>>(uri: string, op: FetchOptions & ApiHookMergeOptions) {
    // for vue-tsc type check failure
    return ($fetch as $Fetch)<T>(url(uri), opt(op) as SafeAny);
  }

  /**
   * request to the given URI with the specified options and get raw response.
   *
   * @param uri - The endpoint URI to request.
   * @param op - Fetch options for the request.
   * @returns A promise of response, default as `T<D> = ApiResult<any>`.
   */
  function raw<D = SafeAny, T = ApiResult<D>>(uri: string, op: FetchOptions & ApiHookMergeOptions) {
    // for vue-tsc type check failure
    return ($fetch as $Fetch).raw<T>(url(uri), opt(op) as SafeAny);
  }

  /**
   * Sends a GET request to the specified URI with optional query parameters and fetch options.
   *
   * @param uri - The endpoint URI to request.
   * @param query - Optional query parameters to include in the request.
   * @param op - Optional fetch options to customize the request.
   * @returns A promise of response, default as `T<D> = DataResult<any>`.
   */
  function get<D = SafeAny, T = DataResult<D>>(uri: string, query?: SafeObj, op?: FetchOptions & ApiHookMergeOptions) {
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
   * @param op - Optional fetch options to customize the request.
   * @returns A promise of response, default as `T<D> = DataResult<any>`.
   */
  function post<D = SafeAny, T = DataResult<D>>(uri: string, body?: SafeObj | URLSearchParams | FormData, op?: FetchOptions & ApiHookMergeOptions) {
    return req<D, T>(uri, {
      ...op,
      method: 'post',
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
