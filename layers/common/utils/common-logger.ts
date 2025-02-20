/**
 * may switch to pino later in server side and production,
 * use consola for now, or client side or development.
 *
 * @see https://github.com/unjs/consola/blob/main/src/consola.ts#L101
 */
import { createConsola } from 'consola';

export const logger = createConsola();

export default logger;
