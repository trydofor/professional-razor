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
export function useInputChecker(opt: {
  el: Ref<SafeAny>;
  check: MayArray<RegExp | ((value: string | Ref<string>, event?: IonInputEvent) => boolean | string)>;
  model?: Ref<string> | (() => string);
  output?: Ref<string> | ((err: string) => void);
  notify?: {
    handle: InstanceType<typeof NoticeCapturer>;
    accept: string | ((ntc: I18nNotice) => boolean | undefined);
    id?: string;
    order?: number;
  };
},
): (ev?: Maybe<IonInputEvent | I18nNotice | Ref<string> | string>) => boolean | string {
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
          const classList = opt.el.value.$el.classList;
          classList.remove('ion-valid');
          classList.add('ion-invalid');
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
    return typeof it === 'function' ? it : (value: string, _?: IonInputEvent) => it.test(value);
  });

  return (ev) => {
    const classList = opt.el.value.$el.classList;
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
        classList.add('ion-touched');
        return true;
      }
      // https://ionicframework.com/docs/api/input#interfaces
      // https://ionicframework.com/docs/api/textarea#interfaces
      event = ev;
      value = typeof ev?.detail?.value === 'string' ? ev.detail.value : undefined;
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
      const r = chk(value, event);
      if (r != null && r !== true) {
        valid = r;
        break;
      }
    }

    if (valid === true) {
      classList.add('ion-valid');
      classList.remove('ion-invalid');
      output('');
    }
    else {
      classList.remove('ion-valid');
      classList.add('ion-invalid');
      output(valid === false ? 'invalid' : valid as string);
    }

    return valid;
  };
}
