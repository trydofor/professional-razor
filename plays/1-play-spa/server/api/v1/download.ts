import { Readable } from 'stream';

// https://nuxt.com/docs/guide/directory-structure/server

/**
 * ```bash
 * curl -v  http://localhost:3000/api/v1/download
 * * Request completely sent off
 * < HTTP/1.1 200 OK
 * < content-disposition: attachment; filename="download.txt"
 * < content-type: text/plain
 * < date: Wed, 12 Feb 2025 12:01:51 GMT
 * < connection: close
 * < transfer-encoding: chunked
 * <
 * download.txt
 * ```
 */
export default defineEventHandler(async (event) => {
  const stream = new Readable({
    read() {
      this.push('download.txt');
      this.push(null);
    },
  });

  event.node.res.setHeader('Content-Disposition', 'attachment; filename="download.txt"');
  event.node.res.setHeader('Content-Type', 'text/plain');

  return sendStream(event, stream);
});
