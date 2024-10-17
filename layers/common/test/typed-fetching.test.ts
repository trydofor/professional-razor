import { describe, it, expect, vi } from 'vitest';
import { fetchingData, fetchingDataAsync } from '../utils/typed-fetching';

describe('fetchingData', () => {
  it('should call loading with true and false', () => {
    const loadingSpy = vi.fn();
    const fetching = { success: true, data: 'test-data' } as DataResult<string>;

    fetchingData(fetching, { loading: loadingSpy });

    expect(loadingSpy).toHaveBeenNthCalledWith(1, true);
    expect(loadingSpy).toHaveBeenNthCalledWith(2, false);
  });

  it('should return data when fetching succeeds', () => {
    const fetching = { success: true, data: 'test-data' } as DataResult<string>;

    const result = fetchingData(fetching);

    expect(result).toBe('test-data');
  });

  it('should call failure when fetching fails', () => {
    const failureSpy = vi.fn();
    const fetching = { success: false, message: 'error-message', code: '404' } as DataResult<string>;

    fetchingData(fetching, { failure: failureSpy });

    expect(failureSpy).toHaveBeenCalledWith('error-message', '404');
  });

  it('should call catches when an error is thrown', () => {
    const catchesSpy = vi.fn();
    const throwingFetching = () => {
      throw new Error('test error');
    };

    fetchingData(throwingFetching, { catches: catchesSpy });

    expect(catchesSpy).toHaveBeenCalledWith(new Error('test error'));
  });

  it('should set loading value in Ref object', () => {
    const loading = ref(false);
    const fetching = { success: true, data: 'test-data' } as DataResult<string>;

    fetchingData(fetching, { loading });

    expect(loading.value).toBe(false); // loading should be set to false after execution
  });
});

describe('fetchingDataAsync', () => {
  it('should call loading with true and false asynchronously', async () => {
    const loadingSpy = vi.fn();
    const fetching = Promise.resolve({ success: true, data: 'async-data' } as DataResult<string>);

    await fetchingDataAsync(fetching, { loading: loadingSpy });

    expect(loadingSpy).toHaveBeenNthCalledWith(1, true);
    expect(loadingSpy).toHaveBeenNthCalledWith(2, false);
  });

  it('should return data when fetching succeeds asynchronously', async () => {
    const fetching = Promise.resolve({ success: true, data: 'async-data' } as DataResult<string>);

    const result = await fetchingDataAsync(fetching);

    expect(result).toBe('async-data');
  });

  it('should call failure when fetching fails asynchronously', async () => {
    const failureSpy = vi.fn();
    const fetching = Promise.resolve({ success: false, message: 'async-error', code: '500' } as DataResult<string>);

    await fetchingDataAsync(fetching, { failure: failureSpy });

    expect(failureSpy).toHaveBeenCalledWith('async-error', '500');
  });

  it('should call catches when an error is thrown asynchronously', async () => {
    const catchesSpy = vi.fn();
    const throwingFetching = () => {
      return Promise.reject(new Error('async test error'));
    };

    await fetchingDataAsync(throwingFetching, { catches: catchesSpy });

    expect(catchesSpy).toHaveBeenCalledWith(new Error('async test error'));
  });

  it('should set loading value in Ref object asynchronously', async () => {
    const loading = ref(false);
    const fetching = Promise.resolve({ success: true, data: 'async-data' } as DataResult<string>);

    await fetchingDataAsync(fetching, { loading });

    expect(loading.value).toBe(false); // loading should be set to false after execution
  });
});
