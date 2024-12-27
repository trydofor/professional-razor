import { loadingController, alertController, type AlertOptions } from '@ionic/vue';
import { fetchTypedResultAsync, type LoadingStatus } from '&razor-common/utils/typed-fetcher';

/**
 * how to alert,
 * - fail alert: failure with failMessage or failCode
 * - error alert: catches with catchErr
 * - true: skip to use default
 * - false: no alert
 */
export type AlertHandler = (failMessage?: string | null, failCode?: string | null, catchErr?: SafeAny) => AlertOptions | boolean;

const _alerter: AlertHandler = (failMessage, failCode, catchErr) => {
  if (catchErr == null) {
    return {
      header: 'Data Processing Error',
      message: failMessage || failCode || 'Failed to fetch data',
      buttons: ['Close'],
    };
  }
  else {
    let message = catchErr.message || 'Network or Server Error';
    const fe = apiRouteFetchError(catchErr);
    if (fe != null) {
      // TODO i18n message
      if (fe.statusCode === 401) {
        message = 'Please login to continue.';
      }
      else if (fe.statusCode === 403) {
        message = 'No permission to access';
      }
    }

    return {
      header: 'Network Request Error',
      message,
      buttons: ['Close'],
    };
  }
};

function _failure(handler: AlertHandler) {
  return (message?: string, code?: string) => {
    let opt = handler(message, code, null);
    if (opt === true) {
      opt = _alerter(message, code, null);
    }
    if (typeof opt !== 'boolean') {
      alertController.create(opt).then(alert => alert.present());
    }
  };
}

function _catches(handler: AlertHandler) {
  return (err: SafeAny) => {
    let opt = handler(null, null, err);
    if (opt === true) {
      opt = _alerter(null, null, err);
    }
    if (typeof opt !== 'boolean') {
      alertController.create(opt).then(alert => alert.present());
    }
  };
}

/**
 * Show loading when fetching data, show alert if failed
 * @param fetching - Promise of DataResult
 * @param loading - Ref of boolean instead of using loadingController
 * @param alerter - handle the alert
 */
export async function ionicFetchDataAsync<T>(fetching: Promise<DataResult<T>>, loading?: TypedFetchOptions['loading'], alerter: AlertHandler = _alerter): Promise<T | null> {
  const result = await ionicFetchResultAsync(fetching, loading, alerter);
  return result.data ?? null;
}

/**
 * Show loading when fetching result, show alert if failed
 * @param fetching - Promise of DataResult
 * @param loading - Ref of boolean instead of using loadingController
 * @param alerter - handle the alert
 */
export async function ionicFetchResultAsync<T>(fetching: Promise<DataResult<T>>, loading?: TypedFetchOptions['loading'], alerter: AlertHandler = _alerter): Promise<DataResult<T>> {
  if (loading) {
    return fetchTypedResultAsync(fetching, {
      loading,
      failure: _failure(alerter),
      catches: _catches(alerter),
    });
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

  return fetchTypedResultAsync(fetching, {
    loading: _loading,
    failure: _failure(alerter),
    catches: _catches(alerter),
  });
}
