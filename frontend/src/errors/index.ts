class MyError extends Error {
  cause;

  constructor(message: string, param?: {cause: any}) {
    super(message);
    this.cause = param?.cause;
  }
}

export class UnauthorizedError extends MyError {
  name = 'UnauthorizedError';
  code = 401;
}

export class BadRequestError extends MyError {
  name = 'BadRequestError';
  code = 400;
}

export class ForbiddenError extends MyError {
  name = 'ForbiddenError';
  code = 403;
}

export class ServerError extends MyError {
  name = 'ServerError';
  code = 500;
}

export class TooManyRequestsError extends MyError {
  name = 'TooManyRequestsError';
  retryAfterSec = 0;
  startedAt = 0;
  code = 429;
}

export class UnprocessableEntityError extends MyError {
  name = 'UnprocessableEntityError';
  code = 422;
}

export class ApiError extends MyError {
  name = 'ApiError';
  code = 500;
}

export class CryptoError extends MyError {
  name = 'CryptoError';
  code = 500;
}
