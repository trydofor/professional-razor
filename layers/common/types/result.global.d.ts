declare global {
  /**
   * - message: default i18n message or template
   * - i18nCode: i18n template code
   * - i18nArgs: i18n template args
   */
  interface I18nMessage {
    message?: string;
    i18nCode?: string;
    i18nArgs?: unknown[];
  }

  /**
   * - type: message type, 'Validation', 'IllegalArgument', 'IllegalState'
   * - target: target input name, 'city', 'tab1.zipcode'
   */
  interface I18nNotice extends I18nMessage {
    type?: string;
    target?: string;
  }

  /**
   * - success: whether the result is success, default false.
   * - code: biz-code/err-code to the caller, should be undefined if empty
   */
  interface ActionResult {
    success: boolean;
    code?: string;
  }

  /**
   * - success: false fixed
   * - code: err-code to the caller, should be undefined if empty
   * - errors: errors cause success to be false, should be undefined if empty.
   */
  interface ErrorResult extends ActionResult {
    errors: I18nNotice[];
  }

  /**
   * - success: true or false
   * - code: biz-code to the caller, should be undefined if empty
   * - data: biz-data to the caller
   * - message: default i18n message or template
   * - i18nCode: i18n template code
   * - i18nArgs: i18n template args
   */
  interface DataResult<T = unknown> extends ActionResult, I18nMessage {
    data?: T;
  }

  interface PageResult<T = unknown> extends DataResult<T[]> {
    page: number;
    size: number;
    sort?: string;
    totalPage: number;
    totalData: number;
  }

  type ApiResult<T = unknown> = DataResult<T> | PageResult<T> | ErrorResult;
}

//
export {};
