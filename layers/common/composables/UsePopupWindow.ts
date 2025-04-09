/**
 * popup a new window to the given url, e.g. for oauth
 * if the popup is blocked, it will return false.
 *
 * @see @capacitor/browser
 * @see https://developer.mozilla.org/docs/Web/API/Window/open
 */
export function usePopupWindow(options = { features: 'popup', target: '_blank' }) {
  let popup: Window | null = null;

  async function open(url: string) {
    popup = window.open(url, options.target, options.features);
    return popup != null;
  }

  async function close() {
    if (popup) {
      popup.close();
      popup = null;
      return true;
    }
    return false;
  }

  function opening() {
    return popup != null && !popup.closed;
  }

  return {
    opening,
    open,
    close,
  };
}
