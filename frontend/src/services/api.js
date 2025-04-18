import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', /* import.meta.env.VITE_API_URL, // exemplo: 'http://localhost:3000/api' */
  withCredentials: true, // necessário para enviar o cookie com o refreshToken
});

// Interceptor de resposta para tratar 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/login') &&
      !originalRequest.url.includes('/refresh')
    ) {
      originalRequest._retry = true;

      const auth = useAuthStore();

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        auth.setToken(data.token); // Atualiza o access token no Pinia
        originalRequest.headers.Authorization = `Bearer ${data.token}`;

        return api(originalRequest); // Reenvia a requisição original
      } catch (refreshError) {
        auth.logout(); // Se falhar no refresh, força logout
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
