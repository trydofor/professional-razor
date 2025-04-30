import { describe, it, expect } from 'vitest';

describe('fixNumStr', () => {
  // Simple formats (return as is)
  it('should handle simple number formats as is', () => {
    expect(fixNumStr('123')).toBe('123');
    expect(fixNumStr('-123')).toBe('-123');
    expect(fixNumStr('0')).toBe('0');
    expect(fixNumStr('0.123')).toBe('0.123');
    expect(fixNumStr('-0.123')).toBe('-0.123');
    expect(fixNumStr('123.456')).toBe('123.456');
    expect(fixNumStr('123.4560')).toBe('123.4560');
  });

  // Leading zeros
  it('should handle leading zeros', () => {
    expect(fixNumStr('000123')).toBe('123');
    expect(fixNumStr('-000123')).toBe('-123');
  });

  // Decimal only (.xxx)
  it('should handle decimal-only numbers', () => {
    expect(fixNumStr('.123')).toBe('0.123');
    expect(fixNumStr('-.123')).toBe('-0.123');
  });

  // Scientific notation
  it('should handle scientific notation', () => {
    expect(fixNumStr('1e3')).toBe('1000');
    expect(fixNumStr('1.23e2')).toBe('123');
    expect(fixNumStr('-1.23e2')).toBe('-123');
  });

  // Thousand separators
  it('should handle thousand separators', () => {
    expect(fixNumStr('-1,234.56')).toBe('-1234.56');
    expect(fixNumStr('1,234.56')).toBe('1234.56');
  });

  // Invalid formats
  it('should handle invalid formats', () => {
    expect(() => fixNumStr('abc')).toThrow();
    expect(() => fixNumStr('')).toThrow();
    expect(() => fixNumStr('.')).toThrow();
    expect(() => fixNumStr('-.')).toThrow();
    expect(() => fixNumStr('+.')).toThrow();
  });

  // Non-string inputs
  it('should handle non-string inputs', () => {
    expect(fixNumStr(123)).toBe('123');
    expect(fixNumStr(-123.456)).toBe('-123.456');
    expect(fixNumStr(0)).toBe('0');
    expect(fixNumStr(null, false)).toBe('');
    expect(fixNumStr(undefined, false)).toBe('');
  });

  // Large numbers
  it('should handle large numbers', () => {
    expect(() => fixNumStr(Number.MAX_SAFE_INTEGER + 1)).toThrow('unsafe number');
    expect(() => fixNumStr(Number.MIN_SAFE_INTEGER - 1)).toThrow('unsafe number');
  });

  // Large numbers
  it('Number.pareseFloat handle bad number', () => {
    expect(fixNumStr('12.34.56')).toBe('12.34');
  });
});

describe('cutNumStr', () => {
  // Basic numbers (positive scale)
  it('should handle basic numbers with positive scale', () => {
    expect(cutNumStr(123, 2)).toBe('123.00');
    expect(cutNumStr(-123, 2)).toBe('-123.00');
  });

  // Truncation (no rounding)
  it('should truncate without rounding', () => {
    expect(cutNumStr('1.999', 2)).toBe('1.99');
    expect(cutNumStr('-1.999', 2)).toBe('-1.99');
  });

  // Zero scale (integer part)
  it('should handle zero scale', () => {
    expect(cutNumStr('123.999', 0)).toBe('123');
    expect(cutNumStr('-123.999', 0)).toBe('-123');
  });

  // Negative scale
  it('should handle negative scale', () => {
    expect(cutNumStr('1234', -2)).toBe('1200');
    expect(cutNumStr('-1234', -2)).toBe('-1200');
    expect(cutNumStr('12', -3)).toBe('0');
    expect(cutNumStr('-12', -3)).toBe('0');
  });

  // Decimal padding and truncation
  it('should pad or truncate decimals to the specified scale', () => {
    expect(cutNumStr('123.4', 2)).toBe('123.40');
    expect(cutNumStr('123.4567', 2)).toBe('123.45');
    expect(cutNumStr('123.45', 2)).toBe('123.45');
  });

  // Mixed precision
  it('should handle mixed decimal and integer precision', () => {
    expect(cutNumStr(123.456, 2)).toBe('123.45');
    expect(cutNumStr(123.456, -2)).toBe('100');
    expect(cutNumStr('123.456', 0)).toBe('123');
  });

  // Edge cases
  it('should handle edge cases', () => {
    expect(cutNumStr(0, 2)).toBe('0.00');
    expect(cutNumStr('0', -2)).toBe('0');
    expect(cutNumStr('0.123', 2)).toBe('0.12');
    expect(cutNumStr('123.', 2)).toBe('123.00');
  });
});

describe('isWellNum', () => {
  // Basic numbers
  it('should handle basic numbers', () => {
    expect(isWellNum('123')).toBe('123');
    expect(isWellNum('-123')).toBe('-123');
    expect(isWellNum('+123')).toBe('123');
    expect(isWellNum('0')).toBe('0');
    expect(isWellNum('+0')).toBe('0');
    expect(isWellNum('-0')).toBe('0');
  });

  // Leading zeros
  it('should handle leading zeros correctly', () => {
    expect(isWellNum('0')).toBe('0');
    expect(isWellNum('0.123')).toBe('0.123');
    expect(isWellNum('00')).toBeUndefined();
    expect(isWellNum('01')).toBeUndefined();
    expect(isWellNum('+01')).toBeUndefined();
    expect(isWellNum('-01')).toBeUndefined();
  });

  // Decimal points
  it('should handle decimal points', () => {
    expect(isWellNum('123.456')).toBe('123.456');
    expect(isWellNum('+123.456')).toBe('123.456');
    expect(isWellNum('-123.456')).toBe('-123.456');
    expect(isWellNum('0.123')).toBe('0.123');
    expect(isWellNum('+0.123')).toBe('0.123');
    expect(isWellNum('-0.123')).toBe('-0.123');
    expect(isWellNum('123.')).toBe('123'); // decimal point at end is removed
    expect(isWellNum('+123.')).toBe('123');
    expect(isWellNum('-123.')).toBe('-123');
  });

  // Separators
  it('should handle default separator (comma)', () => {
    expect(isWellNum('1,234')).toBe('1234');
    expect(isWellNum('1,234.56')).toBe('1234.56');
    expect(isWellNum('1,234,567')).toBe('1234567');
    expect(isWellNum('1,2,3,4')).toBe('1234'); // position doesn't matter
    expect(isWellNum('+1,234')).toBe('1234');
    expect(isWellNum('+1,234.56')).toBe('1234.56');
    expect(isWellNum('+1,234,567')).toBe('1234567');
    expect(isWellNum('+1,2,3,4')).toBe('1234'); // position doesn't matter
    expect(isWellNum('-1,234')).toBe('-1234');
    expect(isWellNum('-1,234.56')).toBe('-1234.56');
    expect(isWellNum('-1,234,567')).toBe('-1234567');
    expect(isWellNum('-1,2,3,4')).toBe('-1234'); // position doesn't matter
  });

  it('should handle custom separators', () => {
    expect(isWellNum('1_234', '_')).toBe('1234');
    expect(isWellNum('1_234.567', '_')).toBe('1234.567');
    expect(isWellNum('1.234_567', '_')).toBe('1.234567');
    expect(isWellNum('1_2_3_4', '_')).toBe('1234');
    expect(isWellNum('+1_234', '_')).toBe('1234');
    expect(isWellNum('+1_234.567', '_')).toBe('1234.567');
    expect(isWellNum('+1.234_567', '_')).toBe('1.234567');
    expect(isWellNum('+1_2_3_4', '_')).toBe('1234');
    expect(isWellNum('-1_234', '_')).toBe('-1234');
    expect(isWellNum('-1_234.567', '_')).toBe('-1234.567');
    expect(isWellNum('-1.234_567', '_')).toBe('-1.234567');
    expect(isWellNum('-1_2_3_4', '_')).toBe('-1234');
  });

  // Invalid formats
  it('should reject invalid formats', () => {
    expect(isWellNum('')).toBeUndefined();
    expect(isWellNum('abc')).toBeUndefined();
    expect(isWellNum('12.34.56')).toBeUndefined();
    expect(isWellNum('12..34')).toBeUndefined();
    expect(isWellNum('.123')).toBeUndefined();
    expect(isWellNum('+')).toBeUndefined();
    expect(isWellNum('-')).toBeUndefined();
    expect(isWellNum('.-')).toBeUndefined();
    expect(isWellNum('1-2')).toBeUndefined();
    expect(isWellNum('1+2')).toBeUndefined();
  });

  // Mixed separators
  it('should reject mixed separators', () => {
    expect(isWellNum('1,234_567')).toBeUndefined();
    expect(isWellNum('1_234,567', '_')).toBeUndefined();
  });

  // Edge cases
  it('should handle edge cases', () => {
    expect(isWellNum('123,.')).toBe('123');
    expect(isWellNum('123,.456')).toBe('123.456');
    expect(isWellNum('123.,456')).toBe('123.456');
    expect(isWellNum('123.,')).toBe('123');
  });
});
