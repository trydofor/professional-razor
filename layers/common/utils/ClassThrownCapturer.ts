type OnErrorCapturedHook = Parameters<typeof onErrorCaptured>[0];

export class ThrownCapturer extends PriorityHook<OnErrorCapturedHook> {
  constructor(inits: ConstructorParameters<typeof PriorityHook>[0] = []) {
    super(inits);
    this._scope = onScopeDispose;
  }

  hookError: OnErrorCapturedHook = (err, vm, info) => {
    return this.call(err, vm, info);
  };

  hookCatch: ((err: SafeAny) => void) = this.hookError as SafeAny;
}
