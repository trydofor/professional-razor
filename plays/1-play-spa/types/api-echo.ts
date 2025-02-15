/**
 * * delay - sleep ##ms to response, default 300
 * * status - response status, default 200
 * * header - response header
 * * body - response body, default empty json
 */
export type ApiEchoBody = {
  delay?: number;
  status?: number;
  header?: Record<string, string>;
  body?: unknown;
};
