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

  it('getDataResult should return DataResult when valid', () => {
    expect(getDataResult(dataResult)).toEqual(dataResult);
    expect(getDataResult(pageResult)).toBeNull(); // pageResult 应该返回 null
    expect(getDataResult(errorResult)).toBeNull(); // errorResult 也应返回 null
    expect(getDataResult(null)).toBeNull();
    expect(getDataResult(undefined)).toBeNull();
  });

  it('getPageResult should return PageResult when valid', () => {
    expect(getPageResult(pageResult)).toEqual(pageResult);
    expect(getPageResult(dataResult)).toBeNull(); // dataResult 应该返回 null
    expect(getPageResult(errorResult)).toBeNull(); // errorResult 也应返回 null
    expect(getPageResult(null)).toBeNull();
    expect(getPageResult(undefined)).toBeNull();
  });

  it('getErrorResult should return ErrorResult when valid', () => {
    expect(getErrorResult(errorResult)).toEqual(errorResult);
    expect(getErrorResult(dataResult)).toBeNull();
    expect(getErrorResult(pageResult)).toBeNull();
    expect(getErrorResult(null)).toBeNull();
    expect(getErrorResult(undefined)).toBeNull();
  });

  describe('getLocaleMessage', () => {
    const mockTranslate = (code: string, args: unknown[]) => {
      if (code === 'hello.world') return 'Hello, World!';
      if (code === 'with.args') return `Hello, ${args[0]}!`;
      return code;
    };

    it('should return translated message when available', () => {
      const msg: I18nMessage = { i18nCode: 'hello.world' };
      expect(getLocaleMessage(msg, mockTranslate)).toBe('Hello, World!');
    });

    it('should return formatted message with arguments', () => {
      const msg: I18nMessage = { i18nCode: 'with.args', i18nArgs: ['Alice'] };
      expect(getLocaleMessage(msg, mockTranslate)).toBe('Hello, Alice!');
    });

    it('should return default message when translation is unavailable', () => {
      const msg: I18nMessage = { i18nCode: 'unknown.code', message: 'Fallback Message' };
      expect(getLocaleMessage(msg, mockTranslate)).toBe('Fallback Message');
    });

    it('should return undefined when no i18nCode or message is provided', () => {
      expect(getLocaleMessage({}, mockTranslate)).toBeUndefined();
    });
  });
});
