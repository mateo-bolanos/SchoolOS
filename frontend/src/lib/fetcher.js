import { appConfig, buildApiUrl } from './config';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiFetch = async (path, options = {}) => {
  const {
    retry = 2,
    backoff = 250,
    method = 'GET',
    headers = {},
    body,
    signal,
    ...rest
  } = options;

  const requestInit = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers
    },
    signal,
    ...rest
  };

  if (body && !(body instanceof FormData) && typeof body === 'object') {
    requestInit.body = JSON.stringify(body);
  } else if (body) {
    requestInit.body = body;
  }

  const endpoint = buildApiUrl(path);
  let lastError;

  for (let attempt = 0; attempt <= retry; attempt += 1) {
    try {
      const response = await fetch(endpoint, requestInit);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
      }

      const contentType = response.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        return response.json();
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Network request failed');

      if (attempt === retry) {
        break;
      }

      await sleep(backoff * 2 ** attempt);
    }
  }

  throw lastError;
};

export const mockFetch = async (resolver, delay = 300) => {
  await sleep(delay);
  return typeof resolver === 'function' ? resolver() : resolver;
};

export const withMockFallback = async (path, resolver, options) => {
  if (appConfig.useMocks) {
    return mockFetch(resolver);
  }

  return apiFetch(path, options);
};
