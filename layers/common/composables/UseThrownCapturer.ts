/**
 * Injection key for the `ThrownCapturer` instance
 */
export const ThrownCapturerInjectKey: InjectionKey<InstanceType<typeof ThrownCapturer>> = Symbol('ThrownCapturerInjectKey');

/**
 * Composable function to manage ThrownCapturer instance injection and error capturing.
 * return the injected or the global one if no args. otherwise, create a new one.
 *
 * @param provider - new instance, and provide it to the Vue if true
 * @param capturer - registers to onErrorCaptured if true
 * @returns ThrownCapturer instance (injected when no args, new instance when creating)
 */
export function useThrownCapturer(provider?: boolean, capturer?: boolean) {
  if (provider == null && capturer == null) {
    return inject(ThrownCapturerInjectKey, globalThrownCapturer);
  }

  const thrownCapturer = new ThrownCapturer();
  if (provider) provide(ThrownCapturerInjectKey, thrownCapturer);
  if (capturer) onErrorCaptured(thrownCapturer.hookError);

  return thrownCapturer;
}
