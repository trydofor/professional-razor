import { Readable } from 'stream';
import { getQuery } from 'h3';

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
  const query = getQuery(event);
  const queryValue = query.f ?? query.filename;
  const rawFilename = Array.isArray(queryValue) ? queryValue[0] : queryValue;
  const filename = rawFilename?.toString().trim();

  if (!filename) {
    return {
      success: false,
      errors: [{ message: 'Filename is required' }],
    };
  }

  const content = typeof query.content === 'string' && query.content !== ''
    ? query.content
    : `download:${filename}`;

  const stream = new Readable({
    read() {
      this.push(content);
      this.push(null);
    },
  });

  const hasNonAscii = /[^\x20-\x7E]/.test(filename);
  const safeName = filename.replace(/"/g, '%22');
  const fallbackName = hasNonAscii ? 'download.bin' : safeName;
  const disposition: string[] = ['attachment', `filename="${fallbackName}"`];
  if (hasNonAscii) {
    disposition.push(`filename*=UTF-8''${encodeURIComponent(filename)}`);
  }

  event.node.res.setHeader('Content-Disposition', disposition.join('; '));
  event.node.res.setHeader('Content-Type', 'application/octet-stream');

  return sendStream(event, stream);
});
