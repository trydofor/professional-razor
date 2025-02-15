import { describe, it, expect, vi } from 'vitest';

const mockDataResult: DataResult<string> = { success: true, data: 'test data' };
const mockPageResult: PageResult<string> = { success: true, data: ['test data'], page: 1, size: 10, totalPage: 1, totalData: 1 };
const mockErrorResult: ErrorResult = { success: false, errors: [{ type: 'Validation', target: 'field', message: 'Invalid input' }] };

describe('typed-fetcher', () => {
  it('should update loading state correctly', async () => {
    const loading = ref(false);
    const mockResult: DataResult<string> = { success: true, data: 'test' };
    const fetching = vi.fn().mockResolvedValue(mockResult);
    await fetchTypedResult(fetching, { loading });
    expect(loading.value).toBe(false);
  });

  it('should handle loading function correctly', async () => {
    const loadingFn = vi.fn();
    const mockResult: DataResult<string> = { success: true, data: 'test' };
    const fetching = vi.fn().mockResolvedValue(mockResult);
    await fetchTypedResult(fetching, { loading: loadingFn });
    expect(loadingFn).toHaveBeenCalledWith(1);
    expect(loadingFn).toHaveBeenCalledWith(0);
  });

  it('fetchTypedData should return DataResult', async () => {
    const result = await fetchTypedData(Promise.resolve(mockDataResult));
    expect(result).toEqual(mockDataResult);
  });

  it('fetchTypedPage should return PageResult', async () => {
    const result = await fetchTypedPage(Promise.resolve(mockPageResult));
    expect(result).toEqual(mockPageResult);
  });

  it('fetchTypedResult should return correct result', async () => {
    const result = await fetchTypedResult(Promise.resolve(mockDataResult));
    expect(result).toEqual(mockDataResult);
  });

  it('fetchTypedResult should handle errors with catches option', async () => {
    const error = new Error('Test error');
    const catchingFn = vi.fn(() => mockErrorResult);

    const result = await fetchTypedResult(
      () => Promise.reject(error),
      { catches: catchingFn },
    );

    expect(result).toEqual(mockErrorResult);
    expect(catchingFn).toHaveBeenCalledWith(error);
  });

  it('fetchTypedResult should rethrow error if catches returns null', async () => {
    const error = new Error('Test error');
    const catchingFn = vi.fn(() => null);

    await expect(fetchTypedResult(
      () => Promise.reject(error),
      { catches: catchingFn },
    )).rejects.toThrow(error);
  });

  it('fetchTypedResult should apply results transformation', async () => {
    const transformFn = vi.fn(() => ({ success: true, data: 'transformed' }));
    const result = await fetchTypedResult(Promise.resolve(mockDataResult), { results: transformFn });
    expect(result).toEqual({ success: true, data: 'transformed' });
  });

  it('getDataResult should return DataResult if valid', () => {
    expect(getDataResult(mockDataResult)).toEqual(mockDataResult);
    expect(getDataResult(mockPageResult)).toBeNull();
    expect(getDataResult(mockErrorResult)).toBeNull();
  });

  it('getPageResult should return PageResult if valid', () => {
    expect(getPageResult(mockPageResult)).toEqual(mockPageResult);
    expect(getPageResult(mockDataResult)).toBeNull();
    expect(getPageResult(mockErrorResult)).toBeNull();
  });

  it('getErrorResult should return ErrorResult if valid', () => {
    expect(getErrorResult(mockErrorResult)).toEqual(mockErrorResult);
    expect(getErrorResult(mockDataResult)).toBeNull();
    expect(getErrorResult(mockPageResult)).toBeNull();
  });
});
