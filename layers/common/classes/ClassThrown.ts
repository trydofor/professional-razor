import type { RouteLocationRaw } from 'vue-router';

/**
 * should navigate to the route
 */
export class NavigateThrown {
  public name = 'NavigateThrown';
  constructor(public route: RouteLocationRaw) {}
}

/**
 * should ignore this thrown
 */
export class IgnoredThrown {
  public name = 'IgnoredThrown';
  constructor(public message: string) {}
}

/**
 * should handle the type and data
 */
export class DataThrown {
  public name = 'DataThrown';
  constructor(public type: string, public data: unknown) {}
}

export interface NotifyThrownBase {
  notifyStyle?: string;
  notifyLevel?: string;
}

/**
 * notify user something in UI
 */
export class NotifyThrown<T extends NotifyThrownBase = NotifyThrownBase> {
  public name = 'NotifyThrown';
  constructor(public notify: T) {}
}

/**
 * i18n notice to user in UI
 */
export class NoticeThrown<T extends I18nNotice = I18nNotice> {
  public name = 'NoticeThrown';
  constructor(public notices: T[]) {}
}
