export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

/** Thrown when an action is on cooldown; `retryAfterSeconds` goes into the Retry-After header. */
export class TooManyRequestsError extends Error {
  constructor(
    message: string,
    readonly retryAfterSeconds: number,
  ) {
    super(message);
    this.name = "TooManyRequestsError";
  }
}
