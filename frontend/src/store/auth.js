import { defineStore } from 'pinia';
import authService from '@/services/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authService.getUserFromStorage(),
    tokenValid: authService.isTokenValid(),
  }),

  actions: {
    async login(login, password) {
      const data = await authService.login(login, password);
      this.user = data.user;
      this.tokenValid = true;
    },

    logout() {
      authService.logout();
      this.user = null;
      this.tokenValid = false;
    },

    async checkAuth() {
      if (!authService.isTokenValid()) {
        console.log('🔄 Token expirado. Tentando renovar...');
        const refreshed = await this.refreshToken();
        this.tokenValid = refreshed;
      }

      if (!this.tokenValid) {
        console.warn('🔴 Falha na renovação do token. Deslogando...');
        this.logout();
      }
    },

    async refreshToken() {
      console.log('🔄 Chamando refreshToken() dentro da store...');
      const refreshed = await authService.refreshToken();
      this.tokenValid = refreshed;
      return refreshed;
    },

    hydrate(state) {
      if (authService.isTokenValid()) {
        state.user = authService.getUserFromStorage();
      } else {
        authService.logout();
      }
    }
  }
});
