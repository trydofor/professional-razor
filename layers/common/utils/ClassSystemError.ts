export class SystemError extends Error {
  constructor(message: string, public attachment?: SafeAny) {
    super(message);
    Object.setPrototypeOf(this, TypeError.prototype);
  }
}
