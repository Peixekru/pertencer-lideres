import apiService from './apiService';
import storageService from './storageService';

const authService = {
  async login(login, password) {
    try {
      const response = await apiService.post('/login', { login, password });

      if (response.data?.token && response.data?.refreshToken) {
        storageService.setItem('user', response.data.user, true);
        storageService.setItem('token', response.data.token);
        storageService.setItem('refresh_token', response.data.refreshToken);
        storageService.setItem('token_expiration', Date.now() + 3600000);
        return response.data;
      } else {
        throw new Error('Token não recebido.');
      }
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erro ao fazer login.');
    }
  },

  logout() {
    storageService.removeItem('user');
    storageService.removeItem('token');
    storageService.removeItem('refresh_token');
    storageService.removeItem('token_expiration');
  },

  getUserFromStorage() {
    return storageService.getItem('user', true);
  },

  getToken() {
    return storageService.getItem('token');
  },

  getRefreshToken() {
    return storageService.getItem('refresh_token');
  },

  isTokenValid() {
    const expiration = storageService.getItem('token_expiration');
    return expiration ? Date.now() < expiration : false;
  },

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return false;

      const response = await apiService.post('/refresh-token', { refreshToken });

      console.log('novo refresh token', response.data);

      localStorage.setItem('token', response.data.token); // 🔹 Mantendo o nome original
      localStorage.setItem('refresh_token', response.data.refreshToken);
      storageService.setItem('token_expiration', Date.now() + 3600000);

      return true;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      return false;
    }
  }

};

export default authService;
