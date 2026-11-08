/**
 * Error carrying an HTTP status code. Throw it from any handler and the
 * server will answer with `{ message }` and the given status.
 */
export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
  }
}
