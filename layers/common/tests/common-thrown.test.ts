import { describe, it, expect } from 'vitest';

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
      throw new ApiResultError(errorResult);
    }
    catch (error) {
      if (error instanceof ApiResultError) {
        expect(error.message).toEqual('Error 2');
        expect(error.errorResult).toEqual(errorResult);
        expect(error.falseResult).toBeUndefined();
      }
      else {
        throw error;
      }
    }

    try {
      throw new ApiResultError(errorResult);
      // normal biz-logic
    }
    catch (err) {
      // rethrow to default errorHandlers
      if (!(err instanceof ApiResultError)) throw err;

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

    const error = new ApiResultError(dataResult);

    expect(error.message).toEqual(TypeApiFalse);
    expect(error.falseResult).toEqual(dataResult);
    expect(error.errorResult).toBeUndefined();
  });

  it('should initialize with a generic ApiResult and set message', () => {
    const apiResult: ApiResult<string> = {
      success: false,
      message: 'An error occurred',
    };

    const error = new ApiResultError(apiResult);

    expect(error.message).toEqual('An error occurred');
    expect(error.falseResult).toEqual(apiResult);
    expect(error.errorResult).toBeUndefined();
  });

  it('should preserve instance of ApiResultError', () => {
    const apiResult: ApiResult<string> = {
      success: false,
      message: 'An error occurred',
    };

    const error = new ApiResultError(apiResult);

    expect(error).toBeInstanceOf(ApiResultError);
  });
});

describe('IgnoredThrown', () => {
  it('should create an instance with a message', () => {
    const ignored = new IgnoredThrown('Test message');
    expect(ignored.name).toBe('IgnoredThrown');
    expect(ignored.message).toBe('Test message');
  });
});

describe('ReturnThrown', () => {
  it('should create an instance with type and data', () => {
    const returnThrown = new ReturnThrown('TestType', { key: 'value' });
    expect(returnThrown.name).toBe('ReturnThrown');
    expect(returnThrown.type).toBe('TestType');
    expect(returnThrown.data).toEqual({ key: 'value' });
  });
});

describe('NoticeThrown', () => {
  const mockI18nNotice = [{ message: 'Notice message' }];
  it('should create an instance with notice data', () => {
    const noticeThrown = new NoticeThrown(mockI18nNotice);
    expect(noticeThrown.name).toBe('NoticeThrown');
    expect(noticeThrown.notice).toEqual(mockI18nNotice);
  });
});

describe('NavigateThrown', () => {
  const mockRoute = { path: '/test' };
  it('should create an instance with a route', () => {
    const navigateThrown = new NavigateThrown(mockRoute);
    expect(navigateThrown.name).toBe('NavigateThrown');
    expect(navigateThrown.route).toEqual(mockRoute);
  });
});

describe('Ignored constant', () => {
  it('should be an instance of IgnoredThrown', () => {
    expect(Ignored).toBeInstanceOf(IgnoredThrown);
    expect(Ignored.name).toBe('IgnoredThrown');
    expect(Ignored.message).toBe('ignored this thrown');
  });
});
