import { describe, it, expect } from 'vitest';
import { ApiResultError, TypeApiFalse } from '../errors/common-error';
import type { ApiResult, ErrorResult, DataResult, I18nNotice } from '../types/common-result';

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
