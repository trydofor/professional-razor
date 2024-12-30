import { loadingController, alertController, type AlertOptions } from '@ionic/vue';
import { fetchTypedResultAsync, type LoadingStatus } from '&razor-common/utils/typed-fetcher';

/**
 * how to alert,
 * - fail alert: failure with failMessage or failCode
 * - error alert: catches with catchErr
 * - true: skip to use default
 * - false: no alert
 */
export type AlertHandler<T> = (result?: Maybe<DataResult<T>>, error?: SafeAny) => AlertOptions | boolean;

const _alerter: AlertHandler<SafeAny> = (result, error) => {
  if (error == null) {
    return {
      header: 'Data Processing Error',
      message: result?.message || result?.code || 'Failed to fetch data',
      buttons: ['Close'],
    };
  }
  else {
    let header = 'Network Request Error';
    let message = error.message || 'Network or Server Error';
    const fe = apiRouteFetchError(error);
    if (fe != null) {
      // TODO i18n message
      if (fe.statusCode === 401) {
        if (fe.data?.success === false) return false; // handled by emit

        header = 'Unauthorized';
        message = 'Please login to continue.';
      }
      else if (fe.statusCode === 403) {
        header = 'Forbidden';
        message = 'No permission to access';
      }
    }

    return {
      header,
      message,
      buttons: ['Close'],
    };
  }
};

function _results<T>(alerter: AlertHandler<T>): TypedFetchOptions<DataResult<T>>['results'] {
  return (result) => {
    if (result?.success) return result;

    let opt = alerter(result, null);
    if (opt === true) {
      opt = _alerter(result, null);
    }
    if (opt != null && typeof opt === 'object') {
      alertController.create(opt).then(alert => alert.present());
    }
    return result ?? { success: false };
  };
}

function _catches<T>(alerter: AlertHandler<T>): TypedFetchOptions<DataResult<T>>['catches'] {
  return (err: SafeAny) => {
    let opt = alerter(null, err);
    if (opt === true) {
      opt = _alerter(null, err);
    }
    if (opt != null && typeof opt === 'object') {
      alertController.create(opt).then(alert => alert.present());
    }
    return { success: false };
  };
}

/**
 * Show loading when fetching data, show alert if alerter return,
 * - fail alert: failure with failMessage or failCode
 * - error alert: catches with catchErr
 * - true: skip to use default
 * - false: no alert
 *
 * @param fetching - Promise of DataResult
 * @param loading - Ref of boolean instead of using loadingController
 * @param alerter - handle the alert
 */
export async function ionicFetchDataAsync<T>(fetching: Promise<DataResult<T>>, loading?: TypedFetchOptions<SafeAny>['loading'], alerter: AlertHandler<T> = _alerter): Promise<T | null> {
  const result = await ionicFetchResultAsync(fetching, loading, alerter);
  return result?.data ?? null;
}

/**
 * Show loading when fetching result, show alert if failed,
 * return `{ success: false }` if got null.
 *
 * @param fetching - Promise of DataResult
 * @param loading - Ref of boolean instead of using loadingController
 * @param alerter - handle the alert
 */
export async function ionicFetchResultAsync<T>(fetching: Promise<DataResult<T>>, loading?: TypedFetchOptions<SafeAny>['loading'], alerter: AlertHandler<T> = _alerter): Promise<DataResult<T>> {
  if (loading) {
    return await fetchTypedResultAsync<DataResult<T>>(fetching, {
      loading,
      results: _results(alerter),
      catches: _catches(alerter),
    }) ?? { success: false };
  }

  const ui = await loadingController.create({
    spinner: 'bubbles',
    message: 'Processing ...',
    duration: 5000,
  });

  const _loading = (sts: LoadingStatus) => {
    if (sts == 1) {
      ui.present();
    }
    else {
      ui.dismiss();
    }
  };

  return await fetchTypedResultAsync(fetching, {
    loading: _loading,
    results: _results(alerter),
    catches: _catches(alerter),
  }) ?? { success: false };
}
