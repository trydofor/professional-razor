export interface TypedKey<T> {
  key: string;
  encode?: (v: T) => string;
  decode?: (v: string) => T;
}

export function encodeTyped<T>(key: TypedKey<T>, value: T) {
  return key.encode?.(value) ?? JSON.stringify(value);
}

export function decodeTyped<T>(key: TypedKey<T>, value: string): T {
  return key.decode?.(value) ?? JSON.parse(value);
}
