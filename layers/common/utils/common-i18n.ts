type I18nTran = (code: string, args?: unknown[]) => Maybe<string>;

/**
 * localize i18n message.
 * if elze is string | undefined, use it as default message.
 * if elze is true, use i18n.message as default message.
 * if elze is false, use i18n.i18nCode or code as default message.
 *
 * @param tc translate function
 * @returns localize function
 */
export function localizeMessage(tc: I18nTran): (i18n?: I18nMessage | string, elze?: boolean | string) => string | undefined {
  return (i18n, elze) => {
    let code: string | undefined;
    let deft: string | undefined;
    let args: unknown[] | undefined;
    if (typeof i18n === 'string') {
      code = i18n;
      deft = typeof elze === 'string' ? elze : elze === false ? code : undefined;
    }
    else if (typeof i18n === 'object') {
      code = i18n.i18nCode;
      deft = typeof elze === 'string' ? elze : elze === false ? i18n.i18nCode : i18n.message;
      args = i18n.i18nArgs;
    }
    else {
      deft = typeof elze === 'string' ? elze : undefined;
    }

    if (code == null || code === '') return deft;
    // const et = te?.(code);
    // if (et === false) return deft;

    const msg = tc(code, args);
    return msg == null || msg === code ? deft : msg;
  };
}
