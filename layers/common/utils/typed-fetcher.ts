export type TypedFetchOptions = {
  /**
   * @param status - true if loading, false if done
   */
  loading?: Ref<boolean> | ((status: boolean) => void);
  /**
   * when DataResult.success is false
   * @param message - DataResult.message
   * @param code - DataResult.code
   */
  failure?: (message?: string, code?: string) => void;
  /**
   * catch of try fetching
   * @param err any caught error
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catches?: (err: any) => void;
};

function _doLoading(status: boolean, loading?: Ref<boolean> | ((status: boolean) => void)): void {
  if (typeof loading === 'function') {
    loading(status);
  }
  else if (loading != null) {
    loading.value = status;
  }
}

function _doResult<T>(failure?: (message?: string, code?: string) => void, result?: DataResult<T>): DataResult<T> {
  if (result == null) return { success: false };
  if (failure && result.success === false) {
    failure(result.message, result.code);
  }
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _doError(err: any, catches?: (err: any) => void): void {
  if (catches) {
    catches(err);
  }
  else {
    throw err;
  }
}

/**
 * fetching data with loading, failure, error handling
 *
 * @param fetching - function/data of DataResult
 * @param options - options to handle loading, failure, error
 */
export function fetchTypedData<T>(
  fetching: DataResult<T> | (() => DataResult<T>),
  options: TypedFetchOptions = {},
): T | null {
  const result = fetchTypedResult(fetching, options);
  return result.data ?? null;
}

/**
 * fetching data with loading, failure, error handling
 * @param fetching - function/Promise of DataResult
 * @param options - options to handle loading, failure, error
 */
export async function fetchTypedDataAsync<T>(
  fetching: Promise<DataResult<T>> | (() => Promise<DataResult<T>>),
  options: TypedFetchOptions = {},
): Promise<T | null> {
  const result = await fetchTypedResultAsync(fetching, options);
  return result.data ?? null;
}

/**
 * fetching result with loading, failure, error handling
 *
 * @param fetching - function/data of DataResult
 * @param options - options to handle loading, failure, error
 */
export function fetchTypedResult<T>(
  fetching: DataResult<T> | (() => DataResult<T>),
  options: TypedFetchOptions = {},
): DataResult<T> {
  _doLoading(true, options.loading);

  try {
    const result = typeof fetching === 'function' ? fetching() : fetching;
    return _doResult(options.failure, result);
  }
  catch (err) {
    _doError(err, options.catches);
  }
  finally {
    _doLoading(false, options.loading);
  }

  return { success: false };
}

/**
 * fetching result with loading, failure, error handling
 * @param fetching - function/Promise of DataResult
 * @param options - options to handle loading, failure, error
 */
export async function fetchTypedResultAsync<T>(
  fetching: Promise<DataResult<T>> | (() => Promise<DataResult<T>>),
  options: TypedFetchOptions = {},
): Promise<DataResult<T>> {
  _doLoading(true, options.loading);

  try {
    const result = await (typeof fetching === 'function' ? fetching() : fetching);
    return _doResult(options.failure, result);
  }
  catch (err) {
    _doError(err, options.catches);
  }
  finally {
    _doLoading(false, options.loading);
  }

  return { success: false };
}
