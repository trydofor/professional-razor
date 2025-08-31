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
 * @see https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/composables/validation.ts
 */

let counter = 0;
export function useInputChecker({
  check,
  model,
  output,
  notify,
}: {
  check: MayArray<RegExp | ((value: string) => boolean | string)>;
  model?: Ref<string> | (() => string);
  output?: Ref<string> | ((err: string) => void);
  notify?: {
    handle: InstanceType<typeof NoticeCapturer>;
    accept: string | ((ntc: I18nNotice) => boolean | undefined);
    id?: string;
    order?: number;
  };
}): (ev?: Maybe<I18nNotice | Ref<string> | string>) => boolean | string {
  const target = typeof notify?.accept === 'string' ? notify.accept : undefined;
  const errors = refToFunction(output);
  const scope = getCurrentScope();

  // regitster notice handler
  if (notify) {
    const tg = notify.accept;
    let acc;
    let id = notify.id;
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

    const localize = scope ? useLocalizeMessage() : (ntc: I18nNotice, _: boolean) => ntc.message ?? '';

    notify.handle.put({
      id,
      order: notify.order || 100,
      hook: (ntc: I18nNotice) => {
        if (acc(ntc)) {
          const msg = localize(ntc, true);
          errors(msg);
          return false;
        }
      },
    });

    // remove on unmount
    if (scope) {
      onScopeDispose(() => notify?.handle.del(id));
    }
  }

  const checks = (Array.isArray(check) ? [...check] : [check]).map((it) => {
    return typeof it === 'function' ? it : (v: string) => it.test(v);
  });

  let mounted = true;
  if (scope) {
    mounted = false;
    onMounted(() => mounted = true);
  }

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
      if (notify?.handle == null) {
        logger.warn('no notice handler, ignored', ev);
      }
      else {
        if (target != null && ev.target == null) {
          ev.target = target;
        }
        notify.handle.emit(ev);
      }
      return true;
    }

    value ??= (typeof model === 'function' ? model() : unref(model)) ?? '';

    let valid: string | boolean = true;
    for (const chk of checks) {
      const r = chk(value);
      if (r != null && r !== true) {
        valid = r;
        break;
      }
    }

    if (mounted) {
      errors(valid === true ? '' : valid === false ? 'invalid' : valid);
    }
    return valid;
  };
}
