﻿import { loadingController, alertController } from '@ionic/vue';
import { fetchingResultAsync } from '~razor-common/utils/typed-fetching';

function _failure(message?: string, code?: string) {
  alertController.create({
    header: 'Failed to fetch data',
    message: message || code || 'Business error',
    buttons: ['Close'],
  }).then((alert) => {
    alert.present();
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _catches(err: any) {
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
export async function ionicFetchingDataAsync<T>(fetching: Promise<DataResult<T>>, loading?: Ref<boolean>): Promise<T | null> {
  const result = await ionicFetchingResultAsync(fetching, loading);
  return result.data ?? null;
}

/**
 * Show loading when fetching result, show alert if failed
 * @param fetching - Promise of DataResult
 * @param loading - Ref of boolean instead of using loadingController
 */
export async function ionicFetchingResultAsync<T>(fetching: Promise<DataResult<T>>, loading?: Ref<boolean>): Promise<DataResult<T>> {
  if (loading) {
    return fetchingResultAsync(fetching, {
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

  const _loading = (bool: boolean) => {
    if (bool) {
      ui.present();
    }
    else {
      ui.dismiss();
    }
  };

  return fetchingResultAsync(fetching, {
    loading: _loading,
    failure: _failure,
    catches: _catches,
  });
}
