import { toast } from 'react-hot-toast';

const defaultApiUrl = 'http://localhost:8000/api';
const baseUrl = (import.meta.env.VITE_API_URL || defaultApiUrl).replace(/\/$/, '');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchJson = async (path, { method = 'GET', retries = 2, backoffMs = 250, schema, ...options } = {}) => {
  const controller = new AbortController();
  const url = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  const fetchOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options,
    signal: controller.signal
  };

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await fetch(url, fetchOptions);
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed with status ${response.status}`);
      }
      const data = await response.json();
      return schema ? schema.parse(data) : data;
    } catch (error) {
      if (attempt === retries) {
        if (error.name !== 'AbortError') {
          toast.error(error.message || 'Unable to reach SchoolOS services.');
        }
        throw error;
      }
      await sleep(backoffMs * (attempt + 1));
    }
    attempt += 1;
  }
  return null;
};

export default fetchJson;
