import type { DataResult } from '../types/common';

export type TypedFetchingOptions = {
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

function _doLoading(status: boolean, loading?: Ref<boolean> | ((status: boolean) => void)) {
  if (typeof loading === 'function') {
    loading(status);
  }
  else if (loading != null) {
    loading.value = status;
  }
}

function _doResult<T>(failure?: (message?: string, code?: string) => void, result?: DataResult<T>) {
  if (result == null) return null;
  if (failure && result.success === false) {
    failure(result.message, result.code);
  }
  return result.data || null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _doError(err: any, catches?: (err: any) => void) {
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
export function fetchingData<T>(
  fetching: DataResult<T> | (() => DataResult<T>),
  options: TypedFetchingOptions = {},
): T | null {
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

  return null;
}

/**
 * fetching data with loading, failure, error handling
 * @param fetching - function/Promise of DataResult
 * @param options - options to handle loading, failure, error
 */
export async function fetchingDataAsync<T>(
  fetching: Promise<DataResult<T>> | (() => Promise<DataResult<T>>),
  options: TypedFetchingOptions = {},
): Promise<T | null> {
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

  return null;
}
