export const TypeApiError = 'ApiErrorResult';
export const TypeApiFalse = 'ApiFalseResult';

/**
 * api result with error or false
 *
 * @class ApiResultError
 * @extends {Error}
 */
export class ApiResultError extends Error {
  public falseResult: DataResult | undefined | null;
  public errorResult: ErrorResult | undefined | null;

  constructor(result: ApiResult) {
    if ('errors' in result) {
      super(result.errors.filter(e => e.message).map(e => e.message).join('\n') || TypeApiError);
      this.errorResult = result;
    }
    else {
      super(result.message || TypeApiFalse);
      this.falseResult = result;
    }
    // https://github.com/nuxt/nuxt/issues/26516
    // Object.setPrototypeOf(this, ApiResultError.prototype);
  }
}

export class SystemError extends Error {
  constructor(message: string, public attachment?: unknown) {
    super(message);
    // Object.setPrototypeOf(this, SystemError.prototype);
  }
}
