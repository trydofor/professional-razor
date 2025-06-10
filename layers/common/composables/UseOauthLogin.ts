type PopupWin = {
  opening: () => boolean;
  open: (url: string) => Promise<boolean>;
  close: () => Promise<boolean>;
};

/**
 * * authing: true if loading(1), false if done/cancel(0) or error(2)
 * * authUrl: get oauth code url by authType
 * * checkToken: loop check the token from authUrl, return
 *   - boolean if done(success/fail)
 *   - number(ms) if next time to check
 */
export type OauthLoginOption = {
  popupWin: PopupWin;
  authing?: Ref<boolean> | ((status: LoadingStatusType) => void);
  authUrl: (authType: string) => Promise<string>;
  checkToken: (authType: string, authUrl: string) => Promise<boolean | number>;
};

/**
 * apple diff from normal oauth.
 * open popup window to auth url
 * then loop check the auth status.
 *
 * @see https://developer.apple.com/documentation/sign_in_with_apple/configuring-your-webpage-for-sign-in-with-apple
 * @see https://developer.apple.com/documentation/signinwithapplerestapi
 */
export function useOauthLogin(options: OauthLoginOption) {
  const popupWin = options.popupWin;
  const defaultMs = 2000;

  function authing(status: LoadingStatusType) {
    if (typeof options.authing === 'function') {
      options.authing(status);
    }
    else {
      (options.authing ?? globalLoadingStatus).value = status === LoadingStatus.Loading;
    }
  }

  async function checking(authType: string, url: string) {
    const open = popupWin.opening();
    try {
      const next = await options.checkToken(authType, url);
      if (typeof next === 'boolean' || !open) {
        authing(LoadingStatus.Done);
        if (open) popupWin.close();
      }
      else {
        setTimeout(() => checking(authType, url), next);
      }
    }
    catch (err) {
      logger.error('check oauth token failed', err);
      authing(LoadingStatus.Error);
      if (open) popupWin.close();
    }
  }

  async function popup(authType: string) {
    let sts: LoadingStatusType = LoadingStatus.Error;
    try {
      const url = await options.authUrl(authType);
      const opened = await popupWin.open(url);
      if (opened) {
        sts = LoadingStatus.Loading;
        setTimeout(() => checking(authType, url), defaultMs);
      }
      return opened;
    }
    catch (err) {
      logger.error('open oauth popup failed', err);
    }
    finally {
      authing(sts);
    }
  }

  return popup;
}
