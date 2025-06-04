/**
 * ```tsx
 * <template>
 *    <VTextField
 *      v-model="firstNameModel"
 *      label="First Name"
 *      :rules="[firstNameCheck]"
 *      clearable
 *      placeholder="Enter text"
 *      :error-messages="firstNameError"
 *    />
 * </template>
 * <script setup lang="ts">
 * const firstNameModel = shallowRef('');
 * const firstNameError = shallowRef('');
 * const firstNameCheck = useInputChecker({
 *        check: /^[\x20-\x7E]{3,}$/,
 *        model: firstNameModel,
 *        output: firstNameError,
 *       });
 * </script>
 * ```
 *
 * generate a validator function for vuetify input.
 */

let counter = 0;
export function useInputChecker(opt: {
  check: MayArray<RegExp | ((value: string | Ref<string>) => boolean | string)>;
  model?: Ref<string> | (() => string);
  output?: Ref<string> | ((err: string) => void);
  notify?: {
    handle: InstanceType<typeof NoticeCapturer>;
    accept: string | ((ntc: I18nNotice) => boolean | undefined);
    id?: string;
    order?: number;
  };
},
): (ev?: Maybe<I18nNotice | Ref<string> | string>) => boolean | string {
  const target = typeof opt.notify?.accept === 'string' ? opt.notify.accept : undefined;
  const output = refToFunction(opt.output);

  // regitster notice handler
  if (opt.notify != null) {
    const tg = opt.notify.accept;
    let acc;
    let id = opt.notify.id;
    if (typeof tg === 'string') {
      acc = (n: I18nNotice) => n.target === tg;
      id ??= tg;
    }
    else {
      acc = tg;
    }

    if (id == null) {
      id = `input-checker-${counter++}`;
      logger.info('no id for notice handler, use counter %s', id);
    }

    const scope = getCurrentScope();
    const localize = scope ? useLocalizeMessage() : (ntc: I18nNotice, _: boolean) => ntc.message ?? '';

    opt.notify.handle.put({
      id,
      order: opt.notify.order || 100,
      hook: (ntc: I18nNotice) => {
        if (acc(ntc)) {
          const msg = localize(ntc, true);
          output(msg);
          return false;
        }
      },
    });
    // remove on unmount
    if (scope) {
      onScopeDispose(() => {
        opt.notify?.handle.del(id);
      });
    }
  }

  const checks = (Array.isArray(opt.check) ? [...opt.check] : [opt.check]).map((it) => {
    return typeof it === 'function' ? it : (v: string) => it.test(v);
  });

  return (ev) => {
    let value: string | undefined;

    if (ev == null) {
      value = undefined;
    }
    else if (typeof ev === 'string') {
      value = ev;
    }
    else if (isRef(ev)) {
      value = ev.value;
    }
    else if (ev instanceof Event) {
      // ignore;
    }
    // must notice
    else {
      if (opt.notify?.handle == null) {
        logger.warn('no notice handler, ignored', ev);
      }
      else {
        if (target != null && ev.target == null) {
          ev.target = target;
        }
        opt.notify.handle.emit(ev);
      }
      return true;
    }

    if (value == null) {
      value = typeof opt.model === 'function' ? opt.model() : opt.model?.value;
      value ??= '';
    }

    let valid: string | boolean = true;
    for (const chk of checks) {
      const r = chk(value);
      if (r != null && r !== true) {
        valid = r;
        break;
      }
    }

    output(valid === true ? '' : valid === false ? 'invalid' : valid);
    return valid;
  };
}
