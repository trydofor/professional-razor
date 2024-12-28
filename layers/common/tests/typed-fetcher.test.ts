import { describe, it, expect, vi } from 'vitest';
import { fetchTypedData, fetchTypedDataAsync } from '../utils/typed-fetcher';

describe('fetchTypedData', () => {
  it('should call loading with status error', () => {
    const loadingSpy = vi.fn();
    const catchesSpy = vi.fn();

    const fetching = () => {
      throw new Error('Test Error');
    };

    expect(() => {
      fetchTypedResult(fetching, { loading: loadingSpy, catches: catchesSpy });
    }).toThrow();

    expect(loadingSpy).toHaveBeenNthCalledWith(1, 1);
    expect(loadingSpy).toHaveBeenNthCalledWith(2, 2);
    expect(catchesSpy).toHaveBeenNthCalledWith(1, new Error('Test Error'));
  });

  it('should call loading with true and false', () => {
    const loadingSpy = vi.fn();
    const fetching = { success: true, data: 'test-data' } as DataResult<string>;

    fetchTypedData(fetching, { loading: loadingSpy });

    expect(loadingSpy).toHaveBeenNthCalledWith(1, 1);
    expect(loadingSpy).toHaveBeenNthCalledWith(2, 0);
  });

  it('should return data when fetching succeeds', () => {
    const fetching = { success: true, data: 'test-data' } as DataResult<string>;

    const result = fetchTypedData(fetching);

    expect(result).toBe('test-data');
  });

  it('should call failure when fetching fails', () => {
    const resultsSpy = vi.fn();
    const fetching = { success: false, message: 'error-message', code: '404' } as DataResult<string>;

    fetchTypedData(fetching, { results: resultsSpy });

    expect(resultsSpy).toHaveBeenCalledWith(fetching);
  });

  it('should call catches when an error is thrown', () => {
    const catchesSpy = vi.fn();
    const throwingFetching = () => {
      throw new Error('test error');
    };

    expect(() => {
      fetchTypedData(throwingFetching, { catches: catchesSpy });
    }).toThrow();

    expect(catchesSpy).toHaveBeenCalledWith(new Error('test error'));
  });

  it('should set loading value in Ref object', () => {
    const loading = ref(false);
    const fetching = { success: true, data: 'test-data' } as DataResult<string>;

    fetchTypedData(fetching, { loading });

    expect(loading.value).toBe(false); // loading should be set to false after execution
  });
});

describe('fetchTypedDataAsync', () => {
  it('should call loading with true and false asynchronously', async () => {
    const loadingSpy = vi.fn();
    const fetching = Promise.resolve({ success: true, data: 'async-data' } as DataResult<string>);

    await fetchTypedDataAsync(fetching, { loading: loadingSpy });

    expect(loadingSpy).toHaveBeenNthCalledWith(1, 1);
    expect(loadingSpy).toHaveBeenNthCalledWith(2, 0);
  });

  it('should return data when fetching succeeds asynchronously', async () => {
    const fetching = Promise.resolve({ success: true, data: 'async-data' } as DataResult<string>);

    const result = await fetchTypedDataAsync(fetching);

    expect(result).toBe('async-data');
  });

  it('should call failure when fetching fails asynchronously', async () => {
    const resultSpy = vi.fn();
    const result = { success: false, message: 'async-error', code: '500' } as DataResult<string>;
    const fetching = Promise.resolve(result);

    await fetchTypedDataAsync(fetching, { results: resultSpy });

    expect(resultSpy).toHaveBeenCalledWith(result);
  });

  it('should call catches when an error is thrown asynchronously', async () => {
    const catchesSpy = vi.fn().mockReturnValue({ data: 'return if error' });
    const throwingFetching = () => {
      return Promise.reject(new Error('async test error'));
    };

    const result = await fetchTypedDataAsync(throwingFetching, { catches: catchesSpy });

    expect(catchesSpy).toHaveBeenCalledWith(new Error('async test error'));
    expect(result).toEqual('return if error');
  });

  it('should set loading value in Ref object asynchronously', async () => {
    const loading = ref(false);
    const fetching = Promise.resolve({ success: true, data: 'async-data' } as DataResult<string>);

    await fetchTypedDataAsync(fetching, { loading });

    expect(loading.value).toBe(false); // loading should be set to false after execution
  });
});

type DataType = { data?: Maybe<string> };

describe('fetchTypedData and fetchTypedDataAsync', () => {
  it('should handle synchronous fetching with results and loading', () => {
    const loading = ref(false);
    const options: TypedFetchOptions<DataType> = {
      loading,
      results: result => ({ data: result?.data?.toUpperCase() }),
    };
    const result = fetchTypedData(() => ({ data: 'test' }), options);

    expect(result).toBe('TEST');
    expect(loading.value).toBe(false);
  });

  it('should handle asynchronous fetching with results and loading', async () => {
    const loading = ref(false);
    const options: TypedFetchOptions<DataType> = {
      loading,
      results: result => ({ data: result?.data?.toUpperCase() }),
    };

    const result = await fetchTypedDataAsync(
      () =>
        new Promise(resolve =>
          setTimeout(() => resolve({ data: 'async-test' }), 100),
        ) as Promise<DataType>,
      options,
    );

    expect(result).toBe('ASYNC-TEST');
    expect(loading.value).toBe(false);
  });

  it('should handle errors in synchronous fetching', () => {
    const catches = vi.fn().mockReturnValue({ data: 'fallback' });
    const options: TypedFetchOptions<DataType> = { catches };

    const result = fetchTypedData(() => {
      throw new Error('Test error');
    }, options);

    expect(result).toBe('fallback');
    expect(catches).toHaveBeenCalled();
  });

  it('should handle errors in asynchronous fetching', async () => {
    const catches = vi.fn().mockReturnValue({ data: 'fallback-async' });
    const options: TypedFetchOptions<DataType> = { catches };

    const result = await fetchTypedDataAsync(
      () =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Async test error')), 100),
        ),
      options,
    );

    expect(result).toBe('fallback-async');
    expect(catches).toHaveBeenCalled();
  });

  it('should throw error if catches return null in synchronous fetching', () => {
    const options: TypedFetchOptions<DataType> = {
      catches: () => null,
    };

    expect(() =>
      fetchTypedData(() => {
        throw new Error('Throwing test error');
      }, options),
    ).toThrow('Throwing test error');
  });

  it('should throw error if catches return null in asynchronous fetching', async () => {
    const options: TypedFetchOptions<DataType> = {
      catches: () => null,
    };

    await expect(
      fetchTypedDataAsync(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Throwing async error')), 100),
          ),
        options,
      ),
    ).rejects.toThrow('Throwing async error');
  });

  it('should use loading callback correctly', () => {
    const loadingCallback = vi.fn();
    const options: TypedFetchOptions<DataType> = {
      loading: (status: LoadingStatus) => loadingCallback(status),
    };

    fetchTypedData(() => ({ data: 'test-loading-callback' }), options);

    expect(loadingCallback).toHaveBeenCalledWith(1);
    expect(loadingCallback).toHaveBeenCalledWith(0);
  });

  it('should use loading ref correctly', async () => {
    const loading = ref(false);
    const options: TypedFetchOptions<DataType> = { loading };

    await fetchTypedDataAsync(
      () =>
        new Promise(resolve =>
          setTimeout(() => resolve({ data: 'test-loading-ref' }), 100),
        ) as Promise<DataType>,
      options,
    );

    expect(loading.value).toBe(false);
  });
});
