import axios from 'axios';

/** Backend mounts all REST routes under `/api` (see backend/src/index.ts). */
export const API_PREFIX = '/api';

/**
 * Server origin only (no path), e.g. `http://localhost:4000` or `https://api.example.com`.
 * If `VITE_API_BASE_URL` still includes `/api` (legacy), it is stripped so paths never become `/api/api/...`.
 */
function normalizeBaseUrl(): string {
  let raw = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  raw = raw.trim().replace(/\/+$/, '');
  if (raw.endsWith('/api')) {
    raw = raw.slice(0, -4);
  }
  return raw;
}

export const apiClient = axios.create({
  baseURL: normalizeBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  res => res,
  err => Promise.reject(err.response?.data || err)
);
