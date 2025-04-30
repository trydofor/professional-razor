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
