import type { LoadingOptions } from '@ionic/core';

export type AppFetchOptions<T = ApiResult> = Omit<TypedFetchOptions<T>, 'loading'> & {
  loading?: TypedFetchOptions<T>['loading'] | LoadingOptions;
};
/**
 * Show loading when fetching result, construct options via alerter
 *
 * @param fetching - function/Promise of DataResult
 * @param options - options to handle loading, result, error
 */
export async function appFetchData<T>(
  fetching: Promise<ApiResult<T>> | (() => Promise<ApiResult<T>>),
  options: AppFetchOptions<ApiResult<T>> | Ref<boolean> = globalLoadingStatus,
): Promise<DataResult<T>> {
  const result = await appFetchResult(fetching, options);
  return mustDataResult(result);
}

/**
 * Show loading when fetching result, construct options via alerter
 *
 * @param fetching - function/Promise of PageResult
 * @param options - options to handle loading, result, error
 */
export async function appFetchPage<T>(
  fetching: Promise<ApiResult<T>> | (() => Promise<ApiResult<T>>),
  options: AppFetchOptions<ApiResult<T>> | Ref<boolean> = globalLoadingStatus,
): Promise<PageResult<T>> {
  const result = await appFetchResult(fetching, options);
  return mustPageResult(result);
}

/**
 * Show loading when fetching result, construct options via alerter
 *
 * @param fetching - Promise of DataResult
 * @param options - alerter to show false and error
 */
export async function appFetchResult<T = ApiResult>(
  fetching: Promise<T> | (() => Promise<T>),
  options: AppFetchOptions<T> | Ref<boolean> = globalLoadingStatus,
): Promise<T> {
  if (isRef(options) || isRef(options.loading) || typeof options.loading === 'function') {
    return await fetchTypedResult<T>(fetching, options as TypedFetchOptions<T>);
  }

  const opts = options.loading ?? { // maybe LoadingOptions
    spinner: 'bubbles',
    message: 'Processing ...',
    duration: 5000,
  } as LoadingOptions;
  const ui = await loadingController.create(opts);

  options.loading = (sts) => {
    if (sts == LoadingStatus.Loading) {
      ui.present();
    }
    else {
      ui.dismiss();
    }
  };

  return await fetchTypedResult(fetching, options as TypedFetchOptions<T>);
}
