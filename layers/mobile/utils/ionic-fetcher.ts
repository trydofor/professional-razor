import { loadingController, alertController } from '@ionic/vue';
import { fetchTypedResultAsync, type LoadingStatus } from '&razor-common/utils/typed-fetcher';

function _failure(message?: string, code?: string) {
  alertController.create({
    header: 'Failed to fetch data',
    message: message || code || 'Business error',
    buttons: ['Close'],
  }).then((alert) => {
    alert.present();
  });
}

function _catches(err: SafeAny) {
  alertController.create({
    header: 'Failed to fetch data',
    message: err.message || 'Network error',
    buttons: ['Close'],
  }).then((alert) => {
    alert.present();
  });
}

/**
 * Show loading when fetching data, show alert if failed
 * @param fetching - Promise of DataResult
 * @param loading - Ref of boolean instead of using loadingController
 */
export async function ionicFetchDataAsync<T>(fetching: Promise<DataResult<T>>, loading?: Ref<boolean> | ((status: LoadingStatus) => void)): Promise<T | null> {
  const result = await ionicFetchResultAsync(fetching, loading);
  return result.data ?? null;
}

/**
 * Show loading when fetching result, show alert if failed
 * @param fetching - Promise of DataResult
 * @param loading - Ref of boolean instead of using loadingController
 */
export async function ionicFetchResultAsync<T>(fetching: Promise<DataResult<T>>, loading?: Ref<boolean> | ((status: LoadingStatus) => void)): Promise<DataResult<T>> {
  if (loading) {
    return fetchTypedResultAsync(fetching, {
      loading,
      failure: _failure,
      catches: _catches,
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
    failure: _failure,
    catches: _catches,
  });
}
