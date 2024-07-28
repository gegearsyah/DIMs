import Config from '@config';
import {
  ApiError,
  BadRequestError,
  ForbiddenError,
  ServerError,
  TooManyRequestsError,
  UnauthorizedError,
  UnprocessableEntityError,
} from '@errors';
import AuthService from './AuthService';

type FetchServiceProps = {
  baseURL?: string;
  headers?: HeadersInit_;
  onSuccess?: (url: string) => void;
  onError?: (url: string, error?: Error) => void;
};

const FetchService = ({
  method = 'GET',
  headers = {},
  baseURL = Config.api.server.baseUrl,
  onSuccess: onSuccessParams,
  onError: onErrorParams,
  ...opts
}: RequestInit & FetchServiceProps = {}) => {
  return async (url: string | URL | Request, options?: RequestInit) => {
    const onSuccess = () => onSuccessParams?.(url.toString());
    const onError = (error?: Error) => onErrorParams?.(url.toString(), error);

    options = {...opts, method, ...options};
    const headersInit: HeadersInit_ = {};
    headersInit.accept = 'application/json';

    if (Object.keys(headers).length > 0) {
      Object.entries(headers).forEach(([key, value]) => {
        headersInit[key] = value;
      });
    }

    if (Object.keys((options?.headers ?? []) as any[]).length > 0) {
      Object.entries((options?.headers ?? []) as any[]).forEach(
        ([key, value]) => {
          headersInit[key] = value;
        },
      );
    }

    if (options.body && !headersInit['Content-Type']) {
      headersInit['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }

    const builtUrl = baseURL ? `${baseURL}/${url}` : url;

    let response;
    try {
      options.headers = headersInit;
      response = await fetch(builtUrl, options);
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.name === 'TypeError' &&
        error.message === 'Network request failed'
      ) {
        // eslint-disable-next-line no-console
        if (__DEV__) console.warn(error);
        const e = new Error(
          'Either you are not connected to the internet, or the server is down. Please check your connection and try again.',
        );
        e.name = 'Network Error';
        onError?.(e);
        throw e;
      } else {
        onError?.(error as Error);
        throw error;
      }
    }

    return await process(response, onSuccess, onError);
  };
};

const process = async (
  response: Response,
  onSuccess?: () => void,
  onError?: (error?: Error) => void,
) => {
  if (response.status >= 200 && response.status < 300) {
    onSuccess?.();
    return await getBody(response);
  } else {
    const error = await getError(response);
    onError?.(error);
    throw error;
  }
};

const getBody = async (response: Response) => {
  try {
    return await response.json();
  } catch (error) {
    if (
      error instanceof SyntaxError &&
      error.message === 'Unexpected end of JSON input'
    ) {
      return {};
    } else {
      throw error;
    }
  }
};

const getError = async (response: Response) => {
  const text = await response.text();
  let error;
  let message;
  let cause;
  let name;
  let retryAfterSec = 0;

  try {
    const json = JSON.parse(text); // Try to parse it as json

    if (json.message || json.detail) {
      message = json.message || json.detail;
      if (json.code === 'INVALID_BODY') {
        message += '\n\n';
        message += json.fields
          .map(
            ({path, message}: {path: string; message: string}) =>
              `${path}: ${message}`,
          )
          .join('\n');
      }
    } else if (json.data?.errorCode) {
      const {errorCode, moreInfo} = json.data;
      message = `${errorCode}: ${moreInfo}`;
    } else if (json.data?.error) {
      const {error, moreInfo} = json.data;
      message = `${error}: ${moreInfo}`;
    } else if (json.data?.moreInfo) {
      const {moreInfo} = json.data;
      message = moreInfo;
    } else {
      message = 'Unknown error: Check "cause" values to see the whole JSON.';
      // eslint-disable-next-line no-console
      if (__DEV__) console.warn(json);
    }

    if (json.code) {
      cause = {error: json.code};
    }
    if (json.cause) {
      cause = json.cause;
    }
    if (json.error) {
      name = json.error;
    }
    if (json.retryAfterSec) {
      retryAfterSec = json.retryAfterSec;
    }
  } catch (err) {
    message = `Unknown error: ${text}`;
  }

  switch (response.status) {
    case 400:
      error = new BadRequestError(message, {cause});
      break;
    case 401:
      error = new UnauthorizedError(message, {cause});
      await AuthService.removeUser();
      await AuthService.removeToken();
      break;
    case 403:
      error = new ForbiddenError(message, {cause});
      break;
    case 404:
      error = new ServerError(
        'The server is down or under maintenance, please try again later.',
        {cause},
      );
      break;
    case 422:
      error = new UnprocessableEntityError(message, {cause});
      break;
    case 429:
      error = new TooManyRequestsError(message, {cause});
      error.retryAfterSec = retryAfterSec;
      error.startedAt = Date.now();
      break;
    case 500:
      error = new ServerError(message, {cause});
      break;
    default:
      error = new ApiError(message, {cause});
      break;
  }

  if (name) {
    error.name = name;
  }

  return error;
};

export default FetchService;
