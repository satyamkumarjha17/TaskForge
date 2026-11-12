import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1', withCredentials: true, headers: { 'Content-Type': 'application/json' } });
let csrfToken: string | null = null;
export async function initializeCsrf() {
  const response = await api.get<{ data: { token: string | null } }>('/auth/csrf');
  csrfToken = response.data.data.token;
}
api.interceptors.request.use((config) => {
  if (config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase()) && csrfToken) {
    config.headers.set('X-CSRF-Token', csrfToken);
  }
  return config;
});
