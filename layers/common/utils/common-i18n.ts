type I18nTran = (code: string, args?: unknown[]) => Maybe<string>;

/**
 * localize i18n message and its args, return empty if got null or undefined.
 *
 * if elze is string | undefined, use it as default message.
 * if elze is true, use i18n.message or (i18n)code as default message.
 * if elze is false, use i18n.message as default message.
 *
 * @param tc translate function
 * @returns localize function
 */
export function localizeMessage(tc: I18nTran): (i18n?: I18nMessage | string, elze?: boolean | string) => string {
  return (i18n, elze) => {
    let code: string | undefined;
    let deft: string | undefined;
    let args: unknown[] | undefined;
    if (i18n == null) {
      deft = typeof elze === 'string' ? elze : undefined;
    }
    else if (typeof i18n === 'string') {
      code = i18n;
      deft = typeof elze === 'string' ? elze : elze === true ? code : undefined;
    }
    else {
      code = i18n.i18nCode;
      if (elze === true) {
        deft = i18n.message ?? i18n.i18nCode;
      }
      else if (elze === false) {
        deft = i18n.message;
      }
      else {
        deft = elze;
      }
      args = i18n.i18nArgs;
    }

    if (code == null || code === '') return deft ?? '';

    if (Array.isArray(args) && args.length > 0) {
      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (typeof arg === 'string') {
          args[i] = tc(arg) ?? arg;
        }
      }
    }

    const msg = tc(code, args);
    return msg == null || msg === code ? deft ?? '' : msg;
  };
}
