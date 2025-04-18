import axios from 'axios';
import authService from './authService';
import { getCookie } from '../utils/cookie';

const apiService = axios.create({
  baseURL: 'http://localhost:3000/api',
});

apiService.interceptors.request.use((config) => {
  return config;
});

apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const hasRefreshToken = getCookie('refreshToken');

      if (!hasRefreshToken) {
        // Cookie já expirou ou foi removido manualmente — nem tenta renovar
        authService.logout(); // isso já faz o router.push('/')
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      const tokenRenovado = await authService.refreshToken();

      if (tokenRenovado) {
        return apiService(originalRequest); // repete a requisição original
      } else {
        authService.logout();
      }
    }

    return Promise.reject(error);
  }
);

export default apiService;