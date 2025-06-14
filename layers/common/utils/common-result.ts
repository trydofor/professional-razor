/**
 * * message: default i18n message or template
 * * i18nCode: i18n template code
 * * i18nArgs: i18n template args
 */
export interface I18nMessage {
  message?: string;
  i18nCode?: string;
  i18nArgs?: unknown[];
}

/**
 * * type: message type, 'Validation', 'IllegalArgument', 'IllegalState'
 * * target: target input name, 'city', 'tab1.zipcode'
 */
export interface I18nNotice extends I18nMessage {
  type?: string;
  target?: string;
}

/**
 * * success: whether the result is success, default false.
 * * code: biz-code/err-code to the caller, should be undefined if empty
 */
export interface ActionResult {
  success: boolean;
  code?: string;
}

/**
 * * success: false fixed
 * * code: err-code to the caller, should be undefined if empty
 * * errors: errors cause success to be false, should be undefined if empty.
 */
export interface ErrorResult extends ActionResult {
  errors: I18nNotice[];
}

/**
 * * success: true or false
 * * code: biz-code to the caller, should be undefined if empty
 * * data: biz-data to the caller
 * * message: default i18n message or template
 * * i18nCode: i18n template code
 * * i18nArgs: i18n template args
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

export function isDataResult<T>(result?: ApiResult<T> | null): result is DataResult<T> {
  return result != null && !('errors' in result);
}

export function mustDataResult<T>(result?: ApiResult<T> | null): DataResult<T> {
  if (isDataResult(result)) {
    return result;
  }
  else {
    throw new SystemError('require DataResult', result);
  }
}

export function isPageResult<T>(result?: ApiResult<T> | null): result is PageResult<T> {
  return isDataResult(result) && typeof (result as SafeAny).page === 'number';
}

export function mustPageResult<T>(result?: ApiResult<T> | null): PageResult<T> {
  if (isPageResult(result)) {
    return result;
  }
  else {
    throw new SystemError('require PageResult', result);
  }
}

export function isErrorResult(result?: ApiResult<SafeAny> | null): result is ErrorResult {
  return (result != null && 'errors' in result);
}
