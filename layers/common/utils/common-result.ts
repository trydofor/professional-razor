/**
 * - message: default i18n message or template
 * - i18nCode: i18n template code
 * - i18nArgs: i18n template args
 */
export interface I18nMessage {
  message?: string;
  i18nCode?: string;
  i18nArgs?: unknown[];
}

/**
 * - type: message type, 'Validation', 'IllegalArgument', 'IllegalState'
 * - target: target input name, 'city', 'tab1.zipcode'
 */
export interface I18nNotice extends I18nMessage {
  type?: string;
  target?: string;
}

/**
 * - success: whether the result is success, default false.
 * - code: biz-code/err-code to the caller, should be undefined if empty
 */
export interface ActionResult {
  success: boolean;
  code?: string;
}

/**
 * - success: false fixed
 * - code: err-code to the caller, should be undefined if empty
 * - errors: errors cause success to be false, should be undefined if empty.
 */
export interface ErrorResult extends ActionResult {
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
export interface DataResult<T = unknown> extends ActionResult, I18nMessage {
  data?: T;
}

export interface PageResult<T = unknown> extends DataResult<T[]> {
  page: number;
  size: number;
  sort?: string;
  totalPage: number;
  totalData: number;
}

export type ApiResult<T = unknown> = DataResult<T> | PageResult<T> | ErrorResult;

export function getDataResult<T>(result?: ApiResult<T> | null): DataResult<T> | null {
  return (result == null || 'errors' in result || 'page' in result) ? null : result;
}

export function getPageResult<T>(result?: ApiResult<T> | null): PageResult<T> | null {
  if (result == null || 'errors' in result) return null;
  return 'page' in result ? result : null;
}

export function getErrorResult(result?: ApiResult<SafeAny> | null): ErrorResult | null {
  return (result != null && 'errors' in result) ? result : null;
}

export function getLocaleMessage(i18n: I18nMessage, tc: (code: string, args: unknown[]) => Maybe<string>): string | undefined {
  const code = i18n.i18nCode;
  const deft = i18n.message;
  if (code == null || code === '') return deft;

  const msg = tc(code, i18n.i18nArgs ?? []);
  return msg == null || (msg === code && deft != null) ? deft : msg;
}
