export type AppErrorKind = 'network' | 'timeout' | 'http' | 'parse' | 'unknown';

export abstract class AppErrorBase extends Error {
  abstract readonly kind: AppErrorKind;
}

export class NetworkError extends AppErrorBase {
  readonly kind = 'network' as const;
  readonly cause?: unknown;
  constructor(cause?: unknown) {
    super('Network error');
    this.name = 'NetworkError';
    this.cause = cause;
  }
}

export class TimeoutError extends AppErrorBase {
  readonly kind = 'timeout' as const;
  readonly timeoutMs: number;
  constructor(timeoutMs: number) {
    super(`Request timed out after ${timeoutMs}ms`);
    this.name = 'TimeoutError';
    this.timeoutMs = timeoutMs;
  }
}

export class HttpError extends AppErrorBase {
  readonly kind = 'http' as const;
  readonly status: number;
  constructor(status: number, message?: string) {
    super(message ?? `HTTP ${status}`);
    this.name = 'HttpError';
    this.status = status;
  }
}

export class ParseError extends AppErrorBase {
  readonly kind = 'parse' as const;
  readonly cause?: unknown;
  constructor(cause?: unknown) {
    super('Failed to parse response');
    this.name = 'ParseError';
    this.cause = cause;
  }
}

export class UnknownAppError extends AppErrorBase {
  readonly kind = 'unknown' as const;
  readonly cause?: unknown;
  constructor(cause?: unknown) {
    super('Unknown error');
    this.name = 'UnknownAppError';
    this.cause = cause;
  }
}

export type AppError =
  | NetworkError
  | TimeoutError
  | HttpError
  | ParseError
  | UnknownAppError;

export function isAppError(value: unknown): value is AppError {
  return (
    value instanceof NetworkError ||
    value instanceof TimeoutError ||
    value instanceof HttpError ||
    value instanceof ParseError ||
    value instanceof UnknownAppError
  );
}

export function mapAppError(error: AppError): string {
  switch (error.kind) {
    case 'network':
      return 'No connection. Check your network.';
    case 'timeout':
      return 'Request took too long.';
    case 'http':
      return error.status === 404 ? 'Not found.' : 'Server error.';
    case 'parse':
      return 'Unexpected response.';
    case 'unknown':
      return 'Something went wrong.';
  }
}
