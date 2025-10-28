import axios from 'axios';

const defaultApiUrl = 'http://localhost:8000/api';
const baseURL = (import.meta.env.VITE_API_URL ?? defaultApiUrl).replace(/\/$/, '');

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
