declare global {

  /**
   * - success: response success
   * - data: response data
   * - message: human i18n message
   * - code: business code
   */
  interface DataResult<T> {
    success: boolean;
    data?: T;
    message?: string;
    code?: string;
  }

  /**
   * `0` if falsy (`null` | `undefined` | `false` | `NaN` | `''`)
   */
  type NumberLike = null | undefined | boolean | number | string | bigint;

  /**
   * alias to `null` | `undefined` | `T`
   */
  type Maybe<T> = null | undefined | T;

  /**
   * `D` if `T` is `null` | `undefined`.
   */
  type OrElse<T, D> = NonNullable<T> | D;

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
   * - good: '123', '0', '-456', '0B0101', '0XFF'
   * - bad: '', 'Infinity', 'NaN', 'a', '+123.5', '-123.5', '3.14e1'
   */
  type StrInt = `${bigint}` | `+${bigint}`;

  /**
   * string style of a number, including both integers and floating point numbers.
   * - good: '123', '45.67', '-89.01'  '0', '3.14e1', '0B0101', '0XFF'
   * - bad: '', 'Infinity', 'NaN', 'a'
   */
  type StrNum = `${number}`;

  /**
   * simple date format in the form of 'yyyy-mm-dd'.
   * - good: '222222-3333-4444', '2024-12-20'
   * - bad: '', '-2024-12-20', '2024', '2024-', '2024-12', '2024-12-', '2024-12-13.', 'a-b-b'
   */
  type StrDate = `${bigint}-${bigint}-${bigint}`;

  /**
   * simple time format in the form of 'HH:MM:ss' or 'HH:MM:ss.SSS'.
   * - good: '222222:3333:4444', '2024:12:20', '2024:12:20.567'
   * - bad: '', '2024:12:', '2024:12', '2024:', '2024', '2024:12:3.14e1', 'a:b:b',
   */
  type StrTime = `${bigint}:${bigint}:${bigint}` | `${bigint}:${bigint}:${bigint}.${bigint}`;

  /**
   * simple date and time in either of two formats:
   * - `${StrDate} ${StrTime}`: 'yyyy-mm-dd HH:MM:ss' (e.g., '2024-12-25 14:30:45')
   * - `${StrDate}T${StrTime}`: 'yyyy-mm-ddTHH:MM:ss' (e.g., '2024-12-25T14:30:45')
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
