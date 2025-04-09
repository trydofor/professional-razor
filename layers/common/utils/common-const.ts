/**
 * true if loading(1), false if done(0) or error(2)
 */
export const LoadingStatus = {
  Done: 0,
  Loading: 1,
  Error: 2,
} as const;

export type LoadingStatusKey = keyof typeof LoadingStatus;
export type LoadingStatusType = typeof LoadingStatus[LoadingStatusKey];
