import { describe, it, expect } from 'vitest';

describe('guessRunMode', () => {
  it('should return null for null or undefined input', () => {
    expect(guessRunMode(null)).toBeNull();
    expect(guessRunMode(undefined)).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(guessRunMode('')).toBeNull();
  });

  it('should correctly identify product mode', () => {
    expect(guessRunMode('prod')).toBe(RunMode.Product);
    expect(guessRunMode('prd')).toBe(RunMode.Product);
    expect(guessRunMode('PRODUCTION')).toBe(RunMode.Product);
  });

  it('should correctly identify test mode', () => {
    expect(guessRunMode('test')).toBe(RunMode.Test);
    expect(guessRunMode('tst')).toBe(RunMode.Test);
    expect(guessRunMode('TESTING')).toBe(RunMode.Test);
  });

  it('should correctly identify develop mode', () => {
    expect(guessRunMode('develop')).toBe(RunMode.Develop);
    expect(guessRunMode('dev')).toBe(RunMode.Develop);
    expect(guessRunMode('DEVELOPER')).toBe(RunMode.Develop);
  });

  it('should correctly identify local mode', () => {
    expect(guessRunMode('local')).toBe(RunMode.Local);
    expect(guessRunMode('lcl')).toBe(RunMode.Local);
    expect(guessRunMode('LOCALHOST')).toBe(RunMode.Local);
  });

  it('should respect index parameter', () => {
    // Should not find any match before index 5
    expect(guessRunMode('This is a test string', 10)).toBe(RunMode.Test);

    // Should find 'dev' starting at index 3
    expect(guessRunMode('My development server', 3)).toBe(RunMode.Develop);
  });

  it('should return null when no match is found', () => {
    expect(guessRunMode('randomstring')).toBeNull();
    expect(guessRunMode('unknownmode')).toBeNull();
  });
});
