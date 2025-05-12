import api from './api';
import refreshLockService from './refreshLockService';
import logger from '#logger';

const authService = {
  async login(login, password) {
    try {
      const { data } = await api.post('/login', { login, password });
      return { user: data.user, token: data.token };
    } catch (error) {
      logger.stErr('Erro no login:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erro ao fazer login.');
    }
  },

  async logout() {
    try {
      await api.post('/logout', {}, { withCredentials: true });
    } catch (error) {
      logger.stErr('Erro ao fazer logout:', error.response?.data || error.message);
    }
  },

  async refreshToken() {
    if (refreshLockService.isLocked()) {
      logger.stInf('Aguardando outra aba terminar o refresh...');
      await refreshLockService.waitForUnlock();
      return {
        isDone: true,
        token: localStorage.getItem('access_token'),
      };
    }

    try {
      refreshLockService.setLock();
      const { data } = await api.post('/refresh-token', {}, { withCredentials: true });

      return {
        user: data.user,
        token: data.token,
        isDone: !!data.token,
      };
    } catch (error) {
      logger.stErr('Erro ao renovar token:', error.response?.data || error.message);
      return { isDone: false, token: null };
    } finally {
      refreshLockService.removeLock();
    }
  },
};

export default authService;
