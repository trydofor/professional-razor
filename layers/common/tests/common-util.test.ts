import { describe, it, expect } from 'vitest';

describe('flatArray', () => {
  it('should flatten mixed values and arrays', () => {
    const result = flatArray([1, [2, 3], 4]);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should handle empty arrays and null values', () => {
    const result = flatArray([[], [1, 2], [undefined], 3]);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should handle only scalar values', () => {
    const result = flatArray([1, 2, 3]);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should handle deeply nested arrays (no deep flattening)', () => {
    const result = flatArray([[1, [2, 3]]]);
    expect(result).toEqual([1, [2, 3]]);
  });

  it('should return an empty array if no values are provided', () => {
    const result = flatArray();
    expect(result).toEqual([]);
  });
});

describe('attachId', () => {
  it('should attach id to object', () => {
    const result = attachId('123', { name: 'test' });
    expect(result).toHaveProperty('id', '123');
    expect(result).toEqual({ name: 'test', id: '123' });
  });

  it('should handle empty object', () => {
    const result = attachId('123', {});
    expect(result).toHaveProperty('id', '123');
  });

  it('should handle function', () => {
    const result = attachId('123', () => {});
    expect(result).toHaveProperty('id', '123');
  });
});

describe('alignNumStr', () => {
  // Test positive scale (decimal places)
  it('should handle positive scale values', () => {
    expect(alignNumStr(2, 2)).toBe('2.00');
    expect(alignNumStr('2', 2)).toBe('2.00');
    expect(alignNumStr('2.0', 2)).toBe('2.00');
    expect(alignNumStr('2.001', 2)).toBe('2.00');
    expect(alignNumStr('2.1', 3)).toBe('2.100');
    expect(alignNumStr(2.567, 1)).toBe('2.5');
  });

  // Test zero scale (integer part only)
  it('should handle zero scale', () => {
    expect(alignNumStr(123.456, 0)).toBe('123');
    expect(alignNumStr('123.789', 0)).toBe('123');
    expect(alignNumStr(123, 0)).toBe('123');
    expect(alignNumStr('123', 0)).toBe('123');
  });

  // Test negative scale (rounding to powers of 10)
  it('should handle negative scale values', () => {
    expect(alignNumStr(1234, -2)).toBe('1200');
    expect(alignNumStr('5678', -3)).toBe('5000');
    expect(alignNumStr(1, -3)).toBe('0');
    expect(alignNumStr('12', -1)).toBe('10');
  });

  // Test negative scale with fix option
  it('should handle negative scale with fix option', () => {
    expect(alignNumStr(1, -3, true)).toBe('000');
    expect(alignNumStr('12', -3, true)).toBe('000');
    expect(alignNumStr(1234, -3, true)).toBe('1000');
  });

  // Test edge cases
  it('should handle edge cases', () => {
    expect(alignNumStr(0, 2)).toBe('0.00');
    expect(alignNumStr('0', -2)).toBe('0');
    expect(alignNumStr('0', -2, true)).toBe('00');
    expect(alignNumStr('.123', 2)).toBe('0.12');
    expect(alignNumStr('123.', 2)).toBe('123.00');
  });
});
