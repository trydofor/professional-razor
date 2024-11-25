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
   * 0 if `null` | `undefined` | `false` | `NaN` | `''`
   */
  type NumberLike = null | undefined | boolean | number | string | bigint;

  /**
   * alias to `null` | `undefined` | `T`
   */
  type Maybe<T> = null | undefined | T;
}

//
export {};
