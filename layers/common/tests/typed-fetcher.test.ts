import { describe, it, expect, vi } from 'vitest';
import { fetchTypedData } from '../utils/typed-fetcher';
import type { DataResult } from '../types/common-result';

describe('fetchTypedData', () => {
  it('should call loading with true and false asynchronously', async () => {
    const loadingSpy = vi.fn();
    const fetching = Promise.resolve({ success: true, data: 'async-data' } as DataResult<string>);

    await fetchTypedData(fetching, { loading: loadingSpy });

    expect(loadingSpy).toHaveBeenNthCalledWith(1, 1);
    expect(loadingSpy).toHaveBeenNthCalledWith(2, 0);
  });

  it('should return data when fetching succeeds asynchronously', async () => {
    const fetching = Promise.resolve({ success: true, data: 'async-data' } as DataResult<string>);

    const result = await fetchTypedData(fetching);

    expect(result).toBe('async-data');
  });

  it('should call failure when fetching fails asynchronously', async () => {
    const resultSpy = vi.fn();
    const result = { success: false, message: 'async-error', code: '500' } as DataResult<string>;
    const fetching = Promise.resolve(result);

    await fetchTypedData(fetching, { results: resultSpy });

    expect(resultSpy).toHaveBeenCalledWith(result);
  });

  it('should call catches when an error is thrown asynchronously', async () => {
    const catchesSpy = vi.fn().mockReturnValue({ data: 'return if error' });
    const throwingFetching = () => {
      return Promise.reject(new Error('async test error'));
    };

    const result = await fetchTypedData(throwingFetching, { catches: catchesSpy });

    expect(catchesSpy).toHaveBeenCalledWith(new Error('async test error'));
    expect(result).toEqual('return if error');
  });

  it('should set loading value in Ref object asynchronously', async () => {
    const loading = ref(false);
    const fetching = Promise.resolve({ success: true, data: 'async-data' } as DataResult<string>);

    await fetchTypedData(fetching, { loading });

    expect(loading.value).toBe(false); // loading should be set to false after execution
  });
});

type DataType = { data?: Maybe<string> };

describe('fetchTypedData with options', () => {
  it('should handle asynchronous fetching with results and loading', async () => {
    const loading = ref(false);
    const options: TypedFetchOptions<DataType> = {
      loading,
      results: result => ({ data: result?.data?.toUpperCase() }),
    };

    const result = await fetchTypedData(
      () =>
        new Promise(resolve =>
          setTimeout(() => resolve({ data: 'async-test' }), 100),
        ) as Promise<DataType>,
      options,
    );

    expect(result).toBe('ASYNC-TEST');
    expect(loading.value).toBe(false);
  });

  it('should handle errors in asynchronous fetching', async () => {
    const catches = vi.fn().mockReturnValue({ data: 'fallback-async' });
    const options: TypedFetchOptions<DataType> = { catches };

    const result = await fetchTypedData(
      () =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(' test error')), 100),
        ),
      options,
    );

    expect(result).toBe('fallback-async');
    expect(catches).toHaveBeenCalled();
  });

  it('should throw error if catches return null in asynchronous fetching', async () => {
    const options: TypedFetchOptions<DataType> = {
      catches: () => null,
    };

    await expect(
      fetchTypedData(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Throwing async error')), 100),
          ),
        options,
      ),
    ).rejects.toThrow('Throwing async error');
  });

  it('should use loading ref correctly', async () => {
    const loading = ref(false);
    const options: TypedFetchOptions<DataType> = { loading };

    await fetchTypedData(
      () =>
        new Promise(resolve =>
          setTimeout(() => resolve({ data: 'test-loading-ref' }), 100),
        ) as Promise<DataType>,
      options,
    );

    expect(loading.value).toBe(false);
  });
});
