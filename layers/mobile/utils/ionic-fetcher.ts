import { loadingController, alertController, type AlertOptions } from '@ionic/vue';
import type { ApiResult, DataResult, PageResult } from '&razor-common/types/common-result';

/**
 * how to alert and return, only one of result and error is not null
 *
 * * alert false
 *   - success == false && error == null
 *   - i.e. FalseResult, ErrorResult if not pre-handling
 * * alert error
 *   - result == null && error != null
 *   - i.e. FetchError, FalseResult, ErrorResult
 * * result - the new result will return if nonnull, nop if null
 */
export type AlertHandler<T = ApiResult> = (result?: Maybe<T>, error?: SafeAny) => { alert?: AlertOptions; result?: T };

export type IonicFetchOptions<T = ApiResult> = TypedFetchOptions<T> & { alerter?: AlertHandler<T> };

/**
 * handle the error and return `{ success: false }`
 */
export const defaultFetchAlerter: AlertHandler<SafeAny> = (result, error) => {
  if (error == null) {
    return {
      alert: {
        header: 'Data Processing Error',
        message: result?.message || result?.code || 'Failed to fetch data',
        buttons: ['Close'],
      },
    };
  }

  let header = 'Network Request Error';
  let message = error.message || 'Network or Server Error';
  // TODO handle errorResult,falseResult and its i18n message
  const fe = apiRouteFetchError(error);
  if (fe != null) {
    if (fe.statusCode === 401) {
      header = 'Unauthorized';
      message = 'Please login to continue.';
    }
    else if (fe.statusCode === 403) {
      header = 'Forbidden';
      message = 'No permission to access';
    }
  }

  return {
    alert: {
      header,
      message,
      buttons: ['Close'],
    },
    result: { success: false },
  };
};

function mergeOpts(options: IonicFetchOptions<SafeAny>): IonicFetchOptions<SafeAny> {
  const alerter = options.alerter;
  if (alerter == null) return options;

  options.results = (result) => {
    if (result?.success === true) return null;

    const opt = alerter(result, null);

    if (opt.alert != null) {
      alertController.create(opt.alert).then(alert => alert.present());
    }
    return opt.result;
  };

  options.catches = (err: SafeAny) => {
    const opt = alerter(null, err);

    if (opt.alert != null) {
      alertController.create(opt.alert).then(alert => alert.present());
    }
    return opt.result;
  };

  return options;
}

/**
 * Show loading when fetching result, construct options via alerter
 *
 * @param fetching - function/Promise of DataResult
 * @param options - options to handle loading, result, error
 */
export async function ionicFetchData<T>(
  fetching: Promise<ApiResult<T>> | (() => Promise<ApiResult<T>>),
  options: IonicFetchOptions<ApiResult<T>> = {},
): Promise<DataResult<T> | null> {
  const result = await ionicFetchResult(fetching, options);
  return getDataResult(result);
}

/**
 * Show loading when fetching result, construct options via alerter
 *
 * @param fetching - function/Promise of PageResult
 * @param options - options to handle loading, result, error
 */
export async function ionicFetchPage<T>(
  fetching: Promise<ApiResult<T>> | (() => Promise<ApiResult<T>>),
  options: IonicFetchOptions<ApiResult<T>> = {},
): Promise<PageResult<T> | null> {
  const result = await ionicFetchResult(fetching, options);
  return getPageResult(result);
}

/**
 * Show loading when fetching result, construct options via alerter
 *
 * @param fetching - Promise of DataResult
 * @param options - alerter to show false and error
 */
export async function ionicFetchResult<T = ApiResult>(
  fetching: Promise<T> | (() => Promise<T>),
  options: IonicFetchOptions<T> = {},
): Promise<T | null> {
  if (options) {
    return await fetchTypedResult<T>(fetching, mergeOpts(options));
  }

  const ui = await loadingController.create({
    spinner: 'bubbles',
    message: 'Processing ...',
    duration: 5000,
  });

  options = {} as TypedFetchOptions<T>;
  options.loading = (sts: LoadingStatus) => {
    if (sts == 1) {
      ui.present();
    }
    else {
      ui.dismiss();
    }
  };

  return await fetchTypedResult(fetching, mergeOpts(options));
}
