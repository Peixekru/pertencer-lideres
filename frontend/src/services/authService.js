import apiService from './apiService';
import storageService from './storageService';
import refreshLockService from './refreshLockService';
import logger from '#logger';

const authService = {
  async login(login, password) {
    try {
      const response = await apiService.post('/login', { login, password }, { withCredentials: true });

      logger.inf('login - retorno do backend', response.data)

      if (response.data?.user) {
        storageService.setItem('user', response.data.user, true);
        return response.data;
      } else {
        throw new Error('Usuário não recebido.');
      }
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erro ao fazer login.');
    }
  },

  async logout() {
    try {
      await apiService.post('/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Erro ao fazer logout:', error.response?.data || error.message);
      // Não precisa lançar um erro aqui, o logout local ainda deve ocorrer
    }
    storageService.removeItem('user');
    // Remove a lógica de roteamento daqui
  },

  getUserFromStorage() {
    logger.err('getUserFromStorage', storageService.getItem('user', true))
    return storageService.getItem('user', true);
  },

  async refreshToken() {
    try {
      // Se outra aba está fazendo o refresh, aguarda
      if (refreshLockService.isLocked()) {
        console.log('🕒 Aguardando outra aba terminar o refresh...');
        await refreshLockService.waitForUnlock();

        const user = storageService.getItem('user', true);
        return !!user; // ✅ só continua se outra aba realmente salvou o user
      }

      // Trava o refresh nessa aba
      refreshLockService.setLock();

      // Faz a requisição para renovar o token
      const response = await apiService.post('/refresh-token', {}, { withCredentials: true });

      logger.err('refreshToken função', response.data)

      // Salva os dados do usuário retornados (se houver)
      if (response.data?.user) {
        storageService.setItem('user', response.data.user, true);
      }

      refreshLockService.removeLock();

      return { isDone: !!response.data, token: response.data.token };
    } catch (error) {
      refreshLockService.removeLock();

      // ⚠️ Apaga o usuário do storage se o refresh falhar
      storageService.removeItem('user');

      console.error('Erro ao renovar token:', error);

      return false; // Indica que o refresh falhou
    }
  }
};

export default authService;