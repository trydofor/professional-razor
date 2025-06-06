/**
 * ```tsx
 * <template>
 *   <IonInput
 *     ref="firstNameRefer"
 *     v-model="firstNameModel"
 *     :error-text="firstNameError"
 *     @ion-input="firstNameCheck"
 *     @ion-blur="firstNameCheck"
 *   />
 * </template>
 * <script setup lang="ts">
 * const firstNameModel = shallowRef('');
 * const firstNameRefer = useTemplateRef('firstNameRefer')
 * const firstNameCheck = useInputChecker({
 *        el: firstNameRefer,
 *        check: /^[0-9]{6,}$/,
 *        model: firstNameModel,
 *        output: firstNameError,
 *        notify: {
 *          handle: noticeCapturer,
 *          accept: 'firstName',
 *        },
 *      });
 * </script>
 * ```
 *
 * generate a validator function for ionic input.
 */

export type IonInputEvent = CustomEvent & { detail: { value?: string | null } };

function isIonInputEvent(event: SafeAny): event is IonInputEvent {
  return 'detail' in event;
}

let counter = 0;
export function useInputChecker({
  el,
  check,
  model,
  output,
  notify,
}: {
  el?: Ref<SafeAny>;
  check: MayArray<RegExp | ((value: string, event?: IonInputEvent) => boolean | string)>;
  model?: Ref<string> | (() => string);
  output?: Ref<string> | ((err: string) => void);
  notify?: {
    handle: InstanceType<typeof NoticeCapturer>;
    accept: string | ((ntc: I18nNotice) => boolean | undefined);
    id?: string;
    order?: number;
  };
}): (ev?: Maybe<IonInputEvent | I18nNotice | Ref<string> | string>) => boolean | string {
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

          const clt = el?.value.$el.classList;
          if (clt) {
            clt.remove('ion-valid');
            clt.add('ion-invalid');
          }
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
    return typeof it === 'function' ? it : (value: string, _?: IonInputEvent) => it.test(value);
  });

  let mounted = true;
  if (scope) {
    mounted = false;
    onMounted(() => mounted = true);
  }

  return (ev) => {
    const clt = el?.value.$el.classList;
    let value: string | undefined;
    let event: IonInputEvent | undefined;

    if (ev == null) {
      value = undefined;
    }
    else if (typeof ev === 'string') {
      value = ev;
    }
    else if (isRef(ev)) {
      value = ev.value;
    }
    else if (isIonInputEvent(ev)) {
      if (/blur/i.test(ev.type)) {
        clt?.add('ion-touched');
        return true;
      }
      // https://ionicframework.com/docs/api/input#interfaces
      // https://ionicframework.com/docs/api/textarea#interfaces
      event = ev;
      value = typeof ev?.detail?.value === 'string' ? ev.detail.value : undefined;
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
      const r = chk(value, event);
      if (r != null && r !== true) {
        valid = r;
        break;
      }
    }

    if (mounted) {
      errors(valid === true ? '' : valid === false ? 'invalid' : valid);
    }

    if (clt) {
      if (valid === true) {
        clt.add('ion-valid');
        clt.remove('ion-invalid');
      }
      else {
        clt.remove('ion-valid');
        clt.add('ion-invalid');
      }
    }

    return valid;
  };
}
