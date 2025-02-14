import type { ApiEchoBody } from '&spa/types/api-echo';

// https://nuxt.com/docs/guide/directory-structure/server

/**
 * ```bash
 * curl -vX POST http://localhost:3000/api/v1/echo \
 *    -H "Content-Type: application/json" \
 *    -d '{"status": 201, "header": {"X-Test": "Hello"}, "body": {"success":true, "message": "Test successful"}}'
 *
 * * upload completely sent off: 102 bytes
 * < HTTP/1.1 201 Created
 * < x-test: Hello
 * < content-type: application/json
 * < date: Wed, 12 Feb 2025 12:04:56 GMT
 * < connection: close
 * < content-length: 53
 * <
 * {
 *   "success": true,
 *   "message": "Test successful"
 * }
 * ```
 */
export default defineEventHandler(async (event) => {
  const requestBody = await readBody<ApiEchoBody>(event);

  const status = requestBody.status ?? 200;
  setResponseStatus(event, status);

  if (requestBody.header) {
    setResponseHeaders(event, requestBody.header);
  }

  return requestBody.body ?? {};
});
