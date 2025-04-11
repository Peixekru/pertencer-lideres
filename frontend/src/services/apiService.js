import axios from 'axios';
import authService from './authService';

const apiService = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// 🔹 Intercepta requisições para adicionar o token automaticamente
apiService.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Intercepta respostas 401 para tentar renovar o token antes de deslogar o usuário
apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const tokenRenovado = await authService.refreshToken();
      if (tokenRenovado) {
        return apiService(error.config); // 🔹 Reenvia a requisição original com o novo token
      } else {
        authService.logout();
        // window.location.href = '/'; // 🔹 Redireciona para login caso não consiga renovar
      }
    }
    return Promise.reject(error);
  }
);

export default apiService;
