export const appConfig = {
  apiUrl: import.meta.env.VITE_API_URL ?? '',
  useMocks: import.meta.env.VITE_USE_MOCKS === undefined ? true : import.meta.env.VITE_USE_MOCKS === 'true'
};

export const buildApiUrl = (path) => {
  if (!path) {
    return appConfig.apiUrl;
  }

  if (/^https?:/i.test(path)) {
    return path;
  }

  const base = appConfig.apiUrl?.replace(/\/$/, '') ?? '';
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  if (!base) {
    return `/${normalizedPath}`;
  }

  return `${base}/${normalizedPath}`;
};
