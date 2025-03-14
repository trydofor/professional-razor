﻿declare global {

  /**
   * `0` if falsy (`null` | `undefined` | `false` | `NaN` | `''` | Infinity)
   */
  type NumberLike = null | undefined | boolean | number | string | bigint;

  /**
   * alias to `null` | `undefined` | `T`
   */
  type Maybe<T> = null | undefined | T;

  /**
   * item or its array
   */
  type MayArray<T> = T | T[];

  /**
   * item of the array or itself
   */
  type NonArray<T> = T extends (infer U)[] ? U : T;

  /**
   * item or its Promise
   */
  type MayPromise<T> = T | Promise<T>;

  /**
   * resolved item of the Promise or itself
   */
  type NonPromise<T> = T extends Promise<infer U> ? U : T;

  /**
   * `D` if `T` is `null` | `undefined`.
   */
  type OrElse<T, D> = NonNullable<T> | D;

  /**
   * typesafe use of `any` to reduce eslint comments
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type SafeAny = any;

  /**
   * typesafe use of `object` to reduce eslint comments
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type SafeObj = Record<string, any>;

  /**
   * typesafe use of `Function` to reduce eslint comments
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  type SafeFun = Function;

  /**
   * short string value of true or false
   */
  type BoolTof = 't' | 'f';
  /**
   * short number value of true or false
   */
  type BoolNum = 1 | 0;

  /**
   * string style of a bigint or int value.
   * * good: '123', '0', '-456', '0B0101', '0XFF'
   * * bad: '', 'Infinity', 'NaN', 'a', '+123.5', '-123.5', '3.14e1'
   */
  type StrInt = `${bigint}` | `+${bigint}`;

  /**
   * string style of a number, including both integers and floating point numbers.
   * * good: '123', '45.67', '-89.01'  '0', '3.14e1', '0B0101', '0XFF'
   * * bad: '', 'Infinity', 'NaN', 'a'
   */
  type StrNum = `${number}`;

  /**
   * simple date format in the form of 'yyyy-mm-dd'.
   * * good: '222222-3333-4444', '2024-12-20'
   * * bad: '', '-2024-12-20', '2024', '2024-', '2024-12', '2024-12-', '2024-12-13.', 'a-b-b'
   */
  type StrDate = `${bigint}-${bigint}-${bigint}`;

  /**
   * simple time format in the form of 'HH:MM:ss' or 'HH:MM:ss.SSS'.
   * * good: '222222:3333:4444', '2024:12:20', '2024:12:20.567'
   * * bad: '', '2024:12:', '2024:12', '2024:', '2024', '2024:12:3.14e1', 'a:b:b',
   */
  type StrTime = `${bigint}:${bigint}:${bigint}` | `${bigint}:${bigint}:${bigint}.${bigint}`;

  /**
   * simple date and time in either of two formats:
   * * `${StrDate} ${StrTime}`: 'yyyy-mm-dd HH:MM:ss' (e.g., '2024-12-25 14:30:45')
   * * `${StrDate}T${StrTime}`: 'yyyy-mm-ddTHH:MM:ss' (e.g., '2024-12-25T14:30:45')
   *
   * avoid Expression produces a union type that is too complex to represent.ts
   */
  type StrDateTime = `${bigint}-${bigint}-${bigint} ${bigint}:${bigint}:${bigint}`
    | `${bigint}-${bigint}-${bigint}T${bigint}:${bigint}:${bigint}`
    | `${bigint}-${bigint}-${bigint} ${bigint}:${bigint}:${bigint}.${bigint}`
    | `${bigint}-${bigint}-${bigint}T${bigint}:${bigint}:${bigint}.${bigint}`;

}

//
export {};
