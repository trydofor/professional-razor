/**
 * true if loading(1), false if done(0) or error(2)
 */
export const enum LoadingStatus {
  Done = 0,
  Loading = 1,
  Error = 2,
};

export type TypedFetchOptions<T = ApiResult> = {
  /**
   * true if loading(1), false if done(0) or error(2)
   */
  loading?: Ref<boolean> | ((status: LoadingStatus) => void);
  /**
   * handle the result to return
   */
  results?: (result?: T) => Maybe<T>;
  /**
   * handle the error of try-catch, should
   * * throws if return null
   * * return if return non-null
   */
  catches?: (err: SafeAny) => Maybe<T>;
} & { throttle?: ThrottleThrownKey };

function _doLoading(status: LoadingStatus, loading?: TypedFetchOptions<SafeAny>['loading']): void {
  if (typeof loading === 'function') {
    loading(status);
  }
  else if (loading != null) {
    loading.value = status === LoadingStatus.Loading;
  }
}

/**
 * fetching data result with loading, result, error handling, null if not data result
 *
 * @param fetching - function/Promise of DataResult
 * @param options - options to handle loading, result, error
 */
export async function fetchTypedData<T>(
  fetching: Promise<ApiResult<T>> | (() => Promise<ApiResult<T>>),
  options: TypedFetchOptions<ApiResult<T>> = {},
): Promise<DataResult<T>> {
  const result = await fetchTypedResult(fetching, options);
  return mustDataResult(result);
}

/**
 * fetching page result with loading, result, error handling, null if not page result
 *
 * @param fetching - function/Promise of PageResult
 * @param options - options to handle loading, result, error
 */
export async function fetchTypedPage<T>(
  fetching: Promise<ApiResult<T>> | (() => Promise<ApiResult<T>>),
  options: TypedFetchOptions<ApiResult<T>> = {},
): Promise<PageResult<T>> {
  const result = await fetchTypedResult(fetching, options);
  return mustPageResult(result);
}
/**
 * fetching any result with loading, result, error handling
 *
 * @param fetching - function/Promise of any result
 * @param options - options to handle loading, result, error
 */
export async function fetchTypedResult<T = ApiResult>(
  fetching: Promise<T> | (() => Promise<T>),
  options: TypedFetchOptions<T> = {},
): Promise<T> {
  throwIfThrottle(options.throttle);
  _doLoading(LoadingStatus.Loading, options.loading);

  let sts: LoadingStatus = LoadingStatus.Done;
  try {
    let result: T = await (typeof fetching === 'function' ? fetching() : fetching);
    if (options.results != null) {
      const tmp = options.results(result);
      if (tmp != null) result = tmp;
    }
    return result;
  }
  catch (err) {
    sts = LoadingStatus.Error;
    if (options.catches != null) {
      const tmp = options.catches(err);
      if (tmp != null) return tmp;
    }
    throw err;
  }
  finally {
    _doLoading(sts, options.loading);
  }
}
