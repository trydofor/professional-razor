import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadingController, alertController } from '@ionic/vue';
import { ionicFetchData } from '../utils/ionic-fetcher';
import type { DataResult } from '&razor-common/types/common-result';

// Mocking Ionic controllers
vi.mock('@ionic/vue', () => ({
  loadingController: {
    create: vi.fn().mockResolvedValue({
      present: vi.fn(),
      dismiss: vi.fn(),
    }),
  },
  alertController: {
    create: vi.fn().mockResolvedValue({
      present: vi.fn(),
    }),
  },
}));

describe('ionicFetchData and ionicFetchResult', () => {
  it('should handle success case with loading ref', async () => {
    const loading = ref(false);
    const mockResult = { success: true, data: 'test-data' };

    const result = await ionicFetchData(Promise.resolve(mockResult), loading);

    expect(result).toBe('test-data');
    expect(loading.value).toBe(false);
    expect(loadingController.create).not.toHaveBeenCalled();
  });

  it('should show loading spinner when no loading ref is provided', async () => {
    const mockResult = { success: true, data: 'spinner-test' };

    const result = await ionicFetchResult(Promise.resolve(mockResult));

    expect(result).toEqual(mockResult);
    expect(loadingController.create).toHaveBeenCalledWith({
      spinner: 'bubbles',
      message: 'Processing ...',
      duration: 5000,
    });
  });

  it('should show alert on failure and handle error with custom alerter', async () => {
    const mockError = new Error('Test Error');

    const customAlerter = vi.fn().mockImplementation((result, error) => ({
      header: 'Custom Error',
      message: error.message,
      buttons: ['Close'],
    }));

    const result = await ionicFetchResult(
      Promise.reject(mockError),
      undefined,
      customAlerter,
    );

    expect(result).toEqual({ success: false });
    expect(customAlerter).toHaveBeenCalledWith(null, mockError);
    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Custom Error',
      message: 'Test Error',
      buttons: ['Close'],
    });
  });

  it('should use default alerter for network errors', async () => {
    const mockError = new Error('Network Error');

    const result = await ionicFetchResult(Promise.reject(mockError));

    expect(result).toEqual({ success: false });
    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Network Request Error',
      message: 'Network Error',
      buttons: ['Close'],
    });
  });

  it('should fallback to default alert if custom alerter returns true', async () => {
    const mockResult = { success: false, message: 'Custom Failure' };

    const customAlerter = vi.fn().mockReturnValue(true);

    const result = await ionicFetchResult(Promise.resolve(mockResult), undefined, customAlerter);

    expect(result).toEqual(mockResult);
    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Data Processing Error',
      message: 'Custom Failure',
      buttons: ['Close'],
    });
  });
});

describe('ionicFetchingData', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('should show loading while fetching and dismiss loading after fetching', async () => {
    const loadingUiMock = { present: vi.fn(), dismiss: vi.fn() };

    (loadingController.create as SafeAny).mockResolvedValue(loadingUiMock);

    const fetching = Promise.resolve({ success: true, data: 'test-data' } as DataResult<string>);

    const result = await ionicFetchData(fetching);

    expect(loadingController.create).toHaveBeenCalledWith({
      spinner: 'bubbles',
      message: 'Processing ...',
      duration: 5000,
    });
    expect(loadingUiMock.present).toHaveBeenCalled();
    expect(loadingUiMock.dismiss).toHaveBeenCalled();
    expect(result).toBe('test-data');
  });

  it('should handle failure by showing an alert when fetching fails', async () => {
    const alertMock = { present: vi.fn() };

    (alertController.create as SafeAny).mockResolvedValue(alertMock);

    const fetching = Promise.resolve({ success: false, message: 'Fetch error', code: '404' } as DataResult<string>);

    await ionicFetchData(fetching);

    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Data Processing Error',
      message: 'Fetch error',
      buttons: ['Close'],
    });
    expect(alertMock.present).toHaveBeenCalled();
  });

  it('should handle catches by showing an alert when an error is thrown', async () => {
    const alertMock = { present: vi.fn() };
    (alertController.create as SafeAny).mockResolvedValue(alertMock);

    const fetching = Promise.reject(new Error('Network error'));

    await ionicFetchData(fetching);

    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Network Request Error',
      message: 'Network error',
      buttons: ['Close'],
    });
    expect(alertMock.present).toHaveBeenCalled();
  });

  it('should update loading Ref when fetching with a loading Ref provided', async () => {
    const loadingRef = ref(false);
    const fetching = Promise.resolve({ success: true, data: 'test-data' } as DataResult<string>);

    const result = await ionicFetchData(fetching, loadingRef);

    expect(loadingRef.value).toBe(false); // loadingRef should be set to false after execution
    expect(result).toBe('test-data');
  });

  it('should call alertFailure when fetching fails and loading Ref is provided', async () => {
    const alertMock = { present: vi.fn() };
    (alertController.create as SafeAny).mockResolvedValue(alertMock);

    const loadingRef = ref(true);
    const fetching = Promise.resolve({ success: false, message: 'Fetch error', code: '500' } as DataResult<string>);

    await ionicFetchData(fetching, loadingRef);

    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Data Processing Error',
      message: 'Fetch error',
      buttons: ['Close'],
    });
    expect(alertMock.present).toHaveBeenCalled();
    expect(loadingRef.value).toBe(false); // loadingRef should be false after execution
  });
});
