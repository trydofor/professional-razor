/**
 * true if loading(1), false if done(0) or error(2)
 */
export type LoadingStatus = 1 | 0 | 2;

export type TypedFetchOptions<T> = {
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
 * fetching data with loading, failure, error handling
 *
 * @param fetching - function/data of DataResult
 * @param options - options to handle loading, failure, error
 */
export function fetchTypedData<T>(
  fetching: { data?: T } | (() => { data?: T }),
  options: TypedFetchOptions<{ data?: T }> = {},
): T | null {
  const result = fetchTypedResult(fetching, options);
  return result?.data ?? null;
}

/**
 * fetching data with loading, failure, error handling
 * @param fetching - function/Promise of DataResult
 * @param options - options to handle loading, failure, error
 */
export async function fetchTypedDataAsync<T>(
  fetching: Promise<{ data?: T }> | (() => Promise<{ data?: T }>),
  options: TypedFetchOptions<{ data?: T }> = {},
): Promise<T | null> {
  const result = await fetchTypedResultAsync(fetching, options);
  return result?.data ?? null;
}

/**
 * fetching result with loading, failure, error handling
 *
 * @param fetching - function/data of DataResult
 * @param options - options to handle loading, failure, error
 */
export function fetchTypedResult<T = DataResult<SafeAny>>(
  fetching: T | (() => T),
  options: TypedFetchOptions<T> = { },
): T | null {
  _doLoading(1, options.loading);

  let sts: LoadingStatus = 0;
  let result: T | null = null;
  try {
    result = typeof fetching === 'function' ? (fetching as (() => T))() : fetching;
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

/**
 * fetching result with loading, failure, error handling
 * @param fetching - function/Promise of DataResult
 * @param options - options to handle loading, failure, error
 */
export async function fetchTypedResultAsync<T>(
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
