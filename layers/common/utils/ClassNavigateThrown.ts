import type { RouteLocationRaw } from 'vue-router';

/**
 * should navigate to the route
 */
export class NavigateThrown {
  public name = 'NavigateThrown';
  constructor(public route: RouteLocationRaw) {}
}
