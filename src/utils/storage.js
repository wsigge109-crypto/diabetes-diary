import { api, setToken } from './api.js';

export async function register({ name, email, password }) {
  const data = await api('/api/auth/register', { method: 'POST', body: { name, email, password } });
  setToken(data.access_token);
  return data.user;
}

export async function login({ email, password }) {
  const data = await api('/api/auth/login', { method: 'POST', body: { email, password } });
  setToken(data.access_token);
  return data.user;
}

export function logout() {
  setToken(null);
}

export function requestPasswordReset(email) {
  return api('/api/auth/forgot', { method: 'POST', body: { email } });
}

export function getMe() {
  return api('/api/auth/me');
}

export function getEntries() {
  return api('/api/entries');
}

export function addEntry({ glucose, context }) {
  return api('/api/entries', { method: 'POST', body: { glucose, context } });
}

export function getRanges() {
  return api('/api/ranges');
}

export function saveRanges(ranges) {
  const body = {};
  for (const [id, r] of Object.entries(ranges)) body[id] = { min: r.min, max: r.max };
  return api('/api/ranges', { method: 'PUT', body });
}
