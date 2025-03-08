/**
 * ```tsx
 * <template>
 *   <IonInput
 *     ref="pkgInputRef"
 *     v-model="pkgInput"
 *     type="number"
 *     error-text="need a positive number"
 *     @ion-input="onPkgInput"
 *     @ion-blur="onPkgInput"
 *   />
 * </template>
 * <script setup lang="ts">
 *   const pkgInputRef = useTemplateRef('pkgInputRef')
 *   const onPkgInput = useIonInputChecker(pkgInputRef, /^[1-9][0-9]?$/, pkgInput);
 * </script>
 * ```
 *
 * generate a validator function for ionic input.
 * @param inputRef input ref
 * @param checkFun check function or regex
 */

export type IonInputEvent = CustomEvent & { detail: { value?: string | null } };

function isIonInputEvent(event: SafeAny): event is IonInputEvent {
  return 'detail' in event;
}

let counter = 0;
export function useIonInputChecker(opt: {
  el: Ref<SafeAny>;
  check: RegExp | ((value: string, event?: IonInputEvent) => boolean);
  model?: Ref<string> | (() => string);
  notify?: {
    handle: InstanceType<ClassNoticeCapturer>;
    output: Ref<string> | ((err: string) => void);
    accept: string | ((ntc: I18nNotice) => boolean | undefined);
    id?: string;
    order?: number;
  };
},
): (ev?: IonInputEvent | I18nNotice | string | null | undefined) => boolean | undefined {
  const target = typeof opt.notify?.accept === 'string' ? opt.notify.accept : undefined;

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
      logger.warn('no id for notice handler, use counter %s', id);
    }

    const out = opt.notify.output;
    const localize = useLocalizeMessage();

    opt.notify.handle.put({
      id,
      order: opt.notify.order || 100,
      hook: (ntc: I18nNotice) => {
        if (acc(ntc)) {
          const msg = localize(ntc, true);
          if (msg) {
            if (typeof out === 'function') {
              out(msg);
            }
            else {
              out.value = msg;
            }
          }
          const classList = opt.el.value.$el.classList;
          classList.remove('ion-valid');
          classList.add('ion-invalid');
          return false;
        }
      },
    });
  }

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
    else if (isIonInputEvent(ev)) {
      if (/blur/i.test(ev.type)) {
        classList.add('ion-touched');
        return;
      }
      // https://ionicframework.com/docs/api/input#interfaces
      // https://ionicframework.com/docs/api/textarea#interfaces
      event = ev;
      value = ev?.detail?.value;
    }
    // only notice
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
      return;
    }

    if (value == null) {
      if (opt.model == null) {
        value = '';
      }
      else {
        value = typeof opt.model === 'function' ? opt.model() : opt.model.value;
      }
    }

    const valid = typeof opt.check === 'function' ? opt.check(value, event) : opt.check.test(value);

    if (valid) {
      classList.add('ion-valid');
      classList.remove('ion-invalid');
    }
    else {
      classList.remove('ion-valid');
      classList.add('ion-invalid');
    }

    return valid;
  };
}
