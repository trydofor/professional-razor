import { handleError as vueHandleError, ErrorCodes } from '@vue/runtime-core';

/**
 * @see // https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/runtime-core/src/errorHandling.ts#L112
 */

export function useVueErrorHandler() {
  const instance = getCurrentInstance();

  function handleError(err: unknown) {
    vueHandleError(err, instance, ErrorCodes.APP_ERROR_HANDLER);
  }

  function handleCatch<R>(fn: () => Promise<R>): Promise<R | undefined>;
  function handleCatch<R>(fn: () => R): R | undefined;
  function handleCatch<R>(fn: () => R | Promise<R>): R | undefined | Promise<R | undefined> {
    try {
      const rt = fn() as SafeAny;
      if (rt != null && typeof rt.then === 'function' && typeof rt.catch === 'function') {
        return (rt as Promise<R>).catch((err) => {
          handleError(err);
          return undefined;
        });
      }
      return rt;
    }
    catch (err) {
      handleError(err);
      return undefined;
    }
  }

  return {
    handleError,
    handleCatch,
  };
}
