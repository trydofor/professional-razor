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
 *   const pkgInputRef = ref();
 *   const onPkgInput = validateIonicInput(pkgInputRef, /^[1-9][0-9]?$/);
 * </script>
 * ```
 *
 * generate a validator function for ionic input.
 * @param inputRef input ref
 * @param checkFun check function or regex
 */
export function ionicValidateInput(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputRef: Ref<any>,
  checkFun: RegExp | ((value: string, event?: Event) => boolean),
): (ev: Event | string) => boolean | null {
  return (ev: Event | string) => {
    const classList = inputRef.value.$el.classList;
    const isValue = typeof ev === 'string';

    if (isValue || /blur/i.test(ev.type)) {
      classList.add('ion-touched');
      if (!isValue) return null;
    }

    const value = isValue ? ev : (ev.target as HTMLInputElement).value;
    const valid = typeof checkFun === 'function' ? checkFun(value, isValue ? undefined : ev) : checkFun.test(value);

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
