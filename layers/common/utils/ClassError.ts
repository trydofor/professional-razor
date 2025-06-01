/**
 * unknown system error
 */
export class SystemError extends Error {
  constructor(message: string, public attachment?: unknown) {
    super(message);
    Object.setPrototypeOf(this, SystemError.prototype);
  }
}
