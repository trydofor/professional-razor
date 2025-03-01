/**
 * true if loading(1), false if done(0) or error(2)
 */
export type LoadingStatus = 1 | 0 | 2;

export type TypedFetchOptions<T = ApiResult> = {
  /**
   * true if loading(1), false if done(0) or error(2)
   */
  loading?: Ref<boolean> | ((status: LoadingStatus) => void);
  /**
   * handle the result to return
   */
  results?: (result?: Maybe<T>) => Maybe<T>;
  /**
   * handle the error of try-catch, should
   * - throws if return null
   * - return if return non-null
   */
  catches?: (err: SafeAny) => Maybe<T>;
};

function _doLoading(status: LoadingStatus, loading?: TypedFetchOptions<SafeAny>['loading']): void {
  if (typeof loading === 'function') {
    loading(status);
  }
  else if (loading != null) {
    loading.value = status === 1;
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
): Promise<DataResult<T> | null> {
  const result = await fetchTypedResult(fetching, options);
  return isDataResult(result) ? result : null;
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
): Promise<PageResult<T> | null> {
  const result = await fetchTypedResult(fetching, options);
  return isPageResult(result) ? result : null;
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
): Promise<T | null> {
  _doLoading(1, options.loading);

  let sts: LoadingStatus = 0;
  let result: T | null = null;
  try {
    result = await (typeof fetching === 'function' ? fetching() : fetching);
    if (options.results != null) {
      const tmp = options.results(result);
      if (tmp != null) result = tmp;
    }
  }
  catch (err) {
    sts = 2;
    if (options.catches != null) {
      const tmp = options.catches(err);
      if (tmp != null) result = tmp;
    }
    if (result == null) throw err;
  }
  finally {
    _doLoading(sts, options.loading);
  }

  return result;
}
