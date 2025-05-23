import { describe, it, expect, vi } from 'vitest';
import { loadingController } from '@ionic/vue';

vi.mock('@ionic/core', () => ({
  loadingController: {
    create: vi.fn(() => ({
      present: vi.fn(),
      dismiss: vi.fn(),
    })),
  },
}));

const mockApiSuccess = async <T>(data: T, page?: number): Promise<ApiResult<T>> => ({
  success: true,
  page,
  data,
});

const mockApiFailure = async (): Promise<ApiResult<null>> => ({
  success: false,
});

describe('appFetch', () => {
  it('should fetch data successfully with a promise', async () => {
    const result = await appFetchData(mockApiSuccess({ id: 1, name: 'test' }));
    expect(result.data).toEqual({ id: 1, name: 'test' });
  });

  it('should fetch data successfully with a function returning a promise', async () => {
    const result = await appFetchData(() => mockApiSuccess({ id: 2, name: 'test2' }));
    expect(result.data).toEqual({ id: 2, name: 'test2' });
  });

  it('should handle an API error correctly', async () => {
    const result = await appFetchData(mockApiFailure());
    expect(result).toEqual({ success: false });
  });

  it('should handle loading with a Ref<boolean>', async () => {
    const loading = ref(false);
    const options: AppFetchOptions = { loading };

    await appFetchData(mockApiSuccess({ id: 3 }), options);
    expect(loading.value).toBe(false);
  });

  it('should handle loading with a function', async () => {
    const loadingFn = vi.fn();
    const options: AppFetchOptions = { loading: loadingFn };

    await appFetchData(mockApiSuccess({ id: 4 }), options);
    expect(loadingFn).toHaveBeenCalledWith(0); // LoadingStatus.Done
  });

  it('should create and show/dismiss a loading spinner when using LoadingOptions', async () => {
    const uiMock = {
      present: vi.fn(),
      dismiss: vi.fn(),
    };
    loadingController.create = vi.fn().mockResolvedValue(uiMock);

    const options: AppFetchOptions = { loading: { message: 'Loading...' } };
    await appFetchData(mockApiSuccess({ id: 5 }), options);

    expect(loadingController.create).toHaveBeenCalledWith({ message: 'Loading...' });
    expect(uiMock.present).toHaveBeenCalled();
    expect(uiMock.dismiss).toHaveBeenCalled();
  });

  it('should work for appFetchPage', async () => {
    const result = await appFetchPage(mockApiSuccess(['a', 'b'], 1));
    expect(result.data).toEqual(['a', 'b']);
  });

  it('should work for appFetchResult with loading options', async () => {
    const options: AppFetchOptions = { loading: { message: 'Loading...' } };
    const result = await appFetchResult(mockApiSuccess({ val: 123 }), options);
    expect((result as DataResult).data).toEqual({ val: 123 });
  });
});
