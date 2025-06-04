import { describe, expect, it } from 'vitest';

describe('ClassError', () => {
  it('ApiResultError - error result', () => {
    const result: ErrorResult = {
      success: false,
      errors: [{
        message: 'test error',
      }],
    };
    const error = new ApiResultError(result);
    expect(error).toBeInstanceOf(ApiResultError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('test error');
    expect(error.errorResult).toBe(result);
    expect(error.falseResult).toBeUndefined();
    expect(error.name).toBe('Error');
  });

  it('ApiResultError - false result', () => {
    const result: DataResult = {
      success: false,
      message: 'test false',
      data: null,
    };
    const error = new ApiResultError(result);
    expect(error).toBeInstanceOf(ApiResultError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('test false');
    expect(error.falseResult).toBe(result);
    expect(error.errorResult).toBeUndefined();
    expect(error.name).toBe('Error');
  });

  it('ApiResultError - error result with empty message', () => {
    const result: ErrorResult = {
      success: false,
      errors: [{
        message: '',
      }],
    };
    const error = new ApiResultError(result);
    expect(error).toBeInstanceOf(ApiResultError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(TypeApiError);
    expect(error.errorResult).toBe(result);
    expect(error.falseResult).toBeUndefined();
    expect(error.name).toBe('Error');
  });

  it('ApiResultError - false result with empty message', () => {
    const result: DataResult = {
      success: false,
      message: '',
      data: null,
    };
    const error = new ApiResultError(result);
    expect(error).toBeInstanceOf(ApiResultError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(TypeApiFalse);
    expect(error.falseResult).toBe(result);
    expect(error.errorResult).toBeUndefined();
    expect(error.name).toBe('Error');
  });

  it('SystemError', () => {
    const error = new SystemError('test system error', { test: 'test' });
    expect(error).toBeInstanceOf(SystemError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('test system error');
    expect(error.attachment).toEqual({ test: 'test' });
    expect(error.name).toBe('Error');
  });

  it('SystemError - no attachment', () => {
    const error = new SystemError('test system error');
    expect(error).toBeInstanceOf(SystemError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('test system error');
    expect(error.attachment).toBeUndefined();
    expect(error.name).toBe('Error');
  });
});
