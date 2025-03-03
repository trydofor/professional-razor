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
  constructor(public type: string, public data: SafeAny) {}
}

/**
 * should notice to user in UI
 */
export class NoticeThrown {
  public name = 'NoticeThrown';
  constructor(public notices: I18nNotice[]) {}
}
