export function captureNoticelikeThrown(capturer = globalNoticeCapturer): Parameters<typeof onErrorCaptured>[0] {
  return (err: SafeAny) => {
    const notices = thrownToNotices(err);

    if (notices) {
      for (const notice of notices) {
        capturer.call(notice);
      }
      return false;
    }
  };
}

export class NoticeCapturer extends PriorityHook<(notice: I18nNotice) => MayPromise<boolean | undefined>> {
  constructor(inits: ConstructorParameters<typeof PriorityHook>[0] = []) {
    super(inits);
    this._scope = onScopeDispose;
  }

  hookError = captureNoticelikeThrown(this);
  hookCatch: ((err: SafeAny) => void) = this.hookError as SafeAny;
}
