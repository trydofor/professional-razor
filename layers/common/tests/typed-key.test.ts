import { describe, it, expect } from 'vitest';

describe('TypedKey Encoding and Decoding', () => {
  it('should encode using custom encode function if provided', () => {
    const key: TypedKey<number> = {
      key: 'test',
      encode: v => `encoded-${v}`,
    };
    expect(encodeTyped(key, 42)).toBe('encoded-42');
  });

  it('should encode using JSON.stringify if no encode function is provided', () => {
    const key: TypedKey<number> = { key: 'test' };
    expect(encodeTyped(key, 42)).toBe('42');
  });

  it('should decode using custom decode function if provided', () => {
    const key: TypedKey<number> = {
      key: 'test',
      decode: v => parseInt(v.replace('decoded-', ''), 10),
    };
    expect(decodeTyped(key, 'decoded-42')).toBe(42);
  });

  it('should decode using JSON.parse if no decode function is provided', () => {
    const key: TypedKey<number> = { key: 'test' };
    expect(decodeTyped(key, '42')).toBe(42);
  });

  it('should correctly handle string values with default encoding/decoding', () => {
    const key: TypedKey<string> = { key: 'test' };
    expect(encodeTyped(key, 'hello')).toBe('"hello"');
    expect(decodeTyped(key, '"hello"')).toBe('hello');
  });
});
