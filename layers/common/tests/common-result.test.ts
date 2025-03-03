import { describe, it, expect } from 'vitest';

describe('API Result Helpers', () => {
  const dataResult: DataResult<string> = {
    success: true,
    data: 'Test Data',
  };

  const pageResult: PageResult<string> = {
    success: true,
    data: ['Item 1', 'Item 2'],
    page: 1,
    size: 10,
    totalPage: 1,
    totalData: 2,
  };

  const errorResult: ErrorResult = {
    success: false,
    errors: [{ type: 'Validation', target: 'email', message: 'Invalid Email' }],
  };

  it('isDataResult should return DataResult when valid', () => {
    expect(isDataResult(dataResult)).toBe(true);
    expect(isDataResult(pageResult)).toBe(true);
    expect(isDataResult(errorResult)).toBe(false);
    expect(isDataResult(null)).toBe(false);
    expect(isDataResult(undefined)).toBe(false);
  });

  it('getPageResult should return PageResult when valid', () => {
    expect(isPageResult(pageResult)).toBe(true);
    expect(isPageResult(dataResult)).toBe(false);
    expect(isPageResult(errorResult)).toBe(false);
    expect(isPageResult(null)).toBe(false);
    expect(isPageResult(undefined)).toBe(false);
  });

  it('getErrorResult should return ErrorResult when valid', () => {
    expect(isErrorResult(errorResult)).toBe(true);
    expect(isErrorResult(dataResult)).toBe(false);
    expect(isErrorResult(pageResult)).toBe(false);
    expect(isErrorResult(null)).toBe(false);
    expect(isErrorResult(undefined)).toBe(false);
  });

  it('should throw SystemError when result is not a DataResult', () => {
    expect(() => mustDataResult({ errors: [] } as SafeAny)).toThrow(/DataResult/);
    expect(() => mustPageResult({ errors: [] } as SafeAny)).toThrow(/PageResult/);
    expect(() => mustPageResult({ data: 1 } as SafeAny)).toThrow(/PageResult/);
  });
});

describe('localizeMessage', () => {
  const mockTranslate = (code: string, args: unknown[]) => {
    if (code === 'hello.world') return 'Hello, World!';
    if (code === 'with.args') return `Hello, ${args[0]}!`;
    return code;
  };

  it('should return translated message when available', () => {
    const msg: I18nMessage = { i18nCode: 'hello.world' };
    expect(localizeMessage(msg, mockTranslate)).toBe('Hello, World!');
  });

  it('should return formatted message with arguments', () => {
    const msg: I18nMessage = { i18nCode: 'with.args', i18nArgs: ['Alice'] };
    expect(localizeMessage(msg, mockTranslate)).toBe('Hello, Alice!');
  });

  it('should return default message when translation is unavailable', () => {
    const msg: I18nMessage = { i18nCode: 'unknown.code', message: 'Fallback Message' };
    expect(localizeMessage(msg, mockTranslate)).toBe('Fallback Message');
  });

  it('should return undefined when no i18nCode or message is provided', () => {
    expect(localizeMessage({}, mockTranslate)).toBeUndefined();
  });
});
