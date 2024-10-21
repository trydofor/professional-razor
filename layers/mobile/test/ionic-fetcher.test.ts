import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadingController, alertController } from '@ionic/vue';
import { ionicFetchDataAsync } from '../utils/ionic-fetcher';

// Mocking Ionic controllers
vi.mock('@ionic/vue', () => ({
  loadingController: {
    create: vi.fn(),
  },
  alertController: {
    create: vi.fn(),
  },
}));

describe('ionicFetchingDataAsync', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('should show loading while fetching and dismiss loading after fetching', async () => {
    const loadingUiMock = { present: vi.fn(), dismiss: vi.fn() };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (loadingController.create as any).mockResolvedValue(loadingUiMock);

    const fetching = Promise.resolve({ success: true, data: 'test-data' } as DataResult<string>);

    const result = await ionicFetchDataAsync(fetching);

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (alertController.create as any).mockResolvedValue(alertMock);

    const fetching = Promise.resolve({ success: false, message: 'Fetch error', code: '404' } as DataResult<string>);

    await ionicFetchDataAsync(fetching);

    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Failed to fetch data',
      message: 'Fetch error',
      buttons: ['Close'],
    });
    expect(alertMock.present).toHaveBeenCalled();
  });

  it('should handle catches by showing an alert when an error is thrown', async () => {
    const alertMock = { present: vi.fn() };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (alertController.create as any).mockResolvedValue(alertMock);

    const fetching = Promise.reject(new Error('Network error'));

    await ionicFetchDataAsync(fetching);

    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Failed to fetch data',
      message: 'Network error',
      buttons: ['Close'],
    });
    expect(alertMock.present).toHaveBeenCalled();
  });

  it('should update loading Ref when fetching with a loading Ref provided', async () => {
    const loadingRef = ref(false);
    const fetching = Promise.resolve({ success: true, data: 'test-data' } as DataResult<string>);

    const result = await ionicFetchDataAsync(fetching, loadingRef);

    expect(loadingRef.value).toBe(false); // loadingRef should be set to false after execution
    expect(result).toBe('test-data');
  });

  it('should call alertFailure when fetching fails and loading Ref is provided', async () => {
    const alertMock = { present: vi.fn() };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (alertController.create as any).mockResolvedValue(alertMock);

    const loadingRef = ref(true);
    const fetching = Promise.resolve({ success: false, message: 'Fetch error', code: '500' } as DataResult<string>);

    await ionicFetchDataAsync(fetching, loadingRef);

    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Failed to fetch data',
      message: 'Fetch error',
      buttons: ['Close'],
    });
    expect(alertMock.present).toHaveBeenCalled();
    expect(loadingRef.value).toBe(false); // loadingRef should be false after execution
  });
});
