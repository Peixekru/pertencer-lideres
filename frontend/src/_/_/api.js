import axios from 'axios';
import { useAuthStore } from '@/store/auth';
import { getActivePinia } from 'pinia';
import { getCookie } from '@/utils/cookie';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Interceptor para injetar o token antes de cada request
api.interceptors.request.use((config) => {
  const authStore = useAuthStore(getActivePinia());
  const token = authStore.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor para lidar com erros (ex: token expirado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const authStore = useAuthStore(getActivePinia());
      const hasRefreshToken = getCookie('refreshToken');

      if (!hasRefreshToken) {
        await authStore.logout();
        return Promise.reject(error);
      }

      try {
        // Tenta renovar o token
        const { data } = await axios.post(`${baseURL}/refresh-token`, {}, { withCredentials: true });

        // Atualiza store com o novo token e user
        authStore.token = data.token;
        authStore.user = data.user;

        // Atualiza o header da request original
        originalRequest.headers.Authorization = `Bearer ${data.token}`;

        // Refaz a request
        return api(originalRequest);
      } catch (refreshError) {
        await authStore.logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;