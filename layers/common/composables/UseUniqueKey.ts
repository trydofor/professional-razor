/**
 * generate unique key by component instance uid and args md5 hash
 */
export function useUniqueKey(): (...args: SafeAny[]) => string {
  const instance = getCurrentInstance();
  if (!instance) throw new Error('useUniqueKey must be used within a Vue component setup');

  const uid = instance.uid;
  return (...args: SafeAny[]) => {
    const hash = safeMd5(args);
    return `${uid}-${hash}`;
  };
}
