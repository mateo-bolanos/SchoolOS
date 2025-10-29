import axios from 'axios';
import { enqueueToast } from '../store/uiStore';

const defaultApiUrl = 'http://localhost:8000/api';
const baseURL = (import.meta.env.VITE_API_URL ?? defaultApiUrl).replace(/\/$/, '');

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetry = (error) => {
  const status = error?.response?.status;
  if (!status) {
    return true;
  }

  return status >= 500 || status === 429;
};

export const fetcher = async (config, options = {}) => {
  const { retries = 2, backoffMs = 300 } = options;
  let attempt = 0;
  let delay = backoffMs;
  let lastError = null;

  while (attempt <= retries) {
    try {
      const response = await api.request(config);
      return response.data;
    } catch (error) {
      lastError = error;
      const shouldAttemptRetry = attempt < retries && shouldRetry(error);

      if (!shouldAttemptRetry) {
        const message = error?.response?.data?.message ?? 'We could not complete that request. Please try again shortly.';
        enqueueToast({ message, severity: 'error' });
        throw error;
      }

      attempt += 1;
      await sleep(delay);
      delay *= 2;
    }
  }

  throw lastError;
};

export default api;
