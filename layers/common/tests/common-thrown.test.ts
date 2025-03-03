import { describe, it, expect, vi } from 'vitest';

describe('ApiResultError', () => {
  it('should initialize with an ErrorResult and set errors', () => {
    const errors: I18nNotice[] = [
      { message: '', type: 'Validation' },
      { message: 'Error 2', type: 'IllegalState' },
    ];
    const errorResult: ErrorResult = {
      success: false,
      code: '400',
      errors,
    };

    try {
      throw newApiResultError(errorResult);
    }
    catch (error) {
      if (isApiResultError(error)) {
        expect(error.message).toEqual('Error 2');
        expect(error.errorResult).toEqual(errorResult);
        expect(error.falseResult).toBeUndefined();
      }
      else {
        throw error;
      }
    }

    try {
      throw newApiResultError(errorResult);
      // normal biz-logic
    }
    catch (err) {
      // rethrow to default errorHandlers
      if (!(isApiResultError(err))) throw err;

      if (err.errorResult != null) {
        // handle errors
      }
      else {
        // handle success=false
      }
    }
  });

  it('should initialize with a DataResult and set result', () => {
    const dataResult: DataResult<string> = {
      success: false,
      code: '404',
      data: 'Not Found',
    };

    const error = newApiResultError(dataResult);

    expect(error.message).toEqual(TypeApiFalse);
    expect(error.falseResult).toEqual(dataResult);
    expect(error.errorResult).toBeUndefined();
  });

  it('should initialize with a generic ApiResult and set message', () => {
    const apiResult: ApiResult<string> = {
      success: false,
      message: 'An error occurred',
    };

    const error = newApiResultError(apiResult);

    expect(error.message).toEqual('An error occurred');
    expect(error.falseResult).toEqual(apiResult);
    expect(error.errorResult).toBeUndefined();
  });

  it('should preserve instance of ApiResultError', () => {
    const apiResult: ApiResult<string> = {
      success: false,
      message: 'An error occurred',
    };

    const error = newApiResultError(apiResult);

    expect(isApiResultError(error)).toBe(true);
  });
});

describe('IgnoredThrown', () => {
  it('should create an instance with a message', () => {
    const ignored = newIgnoredThrown('Test message');
    expect(ignored.name).toBe('IgnoredThrown');
    expect(ignored.message).toBe('Test message');
  });
});

describe('DataThrown', () => {
  it('should create an instance with type and data', () => {
    const dataThrown = newDataThrown('TestType', { key: 'value' });
    expect(dataThrown.name).toBe('DataThrown');
    expect(dataThrown.type).toBe('TestType');
    expect(dataThrown.data).toEqual({ key: 'value' });
  });
});

describe('NoticeThrown', () => {
  const mockI18nNotice = { message: 'Notice message' };
  it('should create an instance with notice data', () => {
    const noticeThrown = newNoticeThrown(mockI18nNotice);
    expect(noticeThrown.name).toBe('NoticeThrown');
    expect(noticeThrown.notices).toEqual([mockI18nNotice]);
  });
});

describe('NavigateThrown', () => {
  const mockRoute = { path: '/test' };
  it('should create an instance with a route', () => {
    const navigateThrown = newNavigateThrown(mockRoute);
    expect(navigateThrown.name).toBe('NavigateThrown');
    expect(navigateThrown.route).toEqual(mockRoute);
  });
});

describe('Ignored constant', () => {
  it('should be an instance of IgnoredThrown', () => {
    expect(isIgnoredThrown(Ignored)).toBe(true);
    expect(Ignored.name).toBe('IgnoredThrown');
    expect(Ignored.message).toBe('ignored this thrown');
  });
});

describe('globalThrownCapturer', () => {
  it('should ignore IgnoredThrown instance', async () => {
    const result = await globalThrownCapturer.call(newIgnoredThrown('ignored message'), null, 'test');
    expect(result).toBe(false);
  });

  it('should handle NoticeThrown and call notices', async () => {
    const notice: I18nNotice = { type: 'warning', message: 'Test Notice' };
    const noticeSpy = vi.spyOn(globalNoticeCapturer, 'call').mockImplementation(() => Promise.resolve(undefined));

    const result = await globalThrownCapturer.call(newNoticeThrown(notice), null, 'test');

    expect(noticeSpy).toHaveBeenCalledWith(notice);
    expect(result).toBe(false);
    noticeSpy.mockRestore();
  });

  it('should handle ApiResultError with error result and hook notices', async () => {
    const noticeSpy = vi.spyOn(globalNoticeCapturer, 'call').mockImplementation(() => Promise.resolve(undefined));

    const errorResult = {
      success: false,
      errors: [{ message: 'API Error Message' }],
    };
    const apiError = newApiResultError(errorResult);

    const result = await globalThrownCapturer.hookError(apiError, null, 'test');

    expect(noticeSpy).toHaveBeenCalledWith({ message: 'API Error Message' });
    expect(result).toBe(false);
    noticeSpy.mockRestore();
  });

  it('should handle ApiResultError with false result and hook notices', async () => {
    const noticeSpy = vi.spyOn(globalNoticeCapturer, 'call').mockImplementation(() => Promise.resolve(undefined));

    const falseResult = {
      success: false,
      message: 'API False Message',
      i18nCode: 'error.false_result',
      i18nArgs: [],
    };
    const apiError = newApiResultError(falseResult);

    const result = await globalThrownCapturer.hookCatch(apiError);

    expect(noticeSpy).toHaveBeenCalledWith({
      type: TypeApiFalse,
      message: 'API False Message',
      i18nCode: 'error.false_result',
      i18nArgs: [],
    });
    expect(result).toBe(false);
    noticeSpy.mockRestore();
  });

  it('should handle NavigateThrown by returning undefined', async () => {
    const navError = newNavigateThrown({ path: '/home' });

    const result = await globalThrownCapturer.call(navError, null, 'test');

    expect(result).toBeUndefined();
  });
});
