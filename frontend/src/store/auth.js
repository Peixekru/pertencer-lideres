import { defineStore } from 'pinia';
import authService from '@/services/authService';
import logger from '#logger'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    _refreshInterval: null // controle do intervalo
  }),

  actions: {
    async login(login, password) {
      const data = await authService.login(login, password);
      this.user = data.user;
      this.token = data.token;
      logger.inf('login - salvo no state', data.user, data.token)
      this.startTokenRefreshInterval(); // inicia o auto-refresh
    },

    async logout() {
      await authService.logout();
      this.user = null;
      this.stopTokenRefreshInterval(); // para o auto-refresh
    },

    async refreshToken() {
      const refreshed = await authService.refreshToken();
      if (!refreshed.isDone) {
        await this.logout();
      }
      logger.deb('token - validado', refreshed.isDone, refreshed.token)
      this.token = refreshed.token;
      return refreshed.isDone;
    },

    startTokenRefreshInterval() {
      this.stopTokenRefreshInterval(); // evita duplicidade
      this._refreshInterval = setInterval(async () => {
        const success = await this.refreshToken();
        if (!success) {
          this.logout();
        }
      }, 50 * 60 * 1000); // 50 minutos
      logger.war('Interval - inicio')
    },

    stopTokenRefreshInterval() {
      if (this._refreshInterval) {
        clearInterval(this._refreshInterval);
        this._refreshInterval = null;
      }
      logger.war('Interval - fim')
    },

    hydrate() {
      this.user = authService.getUserFromStorage();
      //this.startTokenRefreshInterval();
      logger.err('função - hydrate', this.user)
    },
  }
});