import { defineStore } from 'pinia'
import router from '@/router'
import authService from '@/services/authService'
//import logger from '#logger';

export const useAuthStore = defineStore('auth', {
  // Estado inicial
  state: () => ({ user: null, token: null, refreshInterval: null }),
  // Persistência do estado
  persist: {
    storage: localStorage,
    pick: ['user', 'token'],
  },
  // Getters
  actions: {
    async login(login, password) {
      const { user, token } = await authService.login(login, password)
      this.user = user
      this.token = token
      this.startTokenRefreshInterval()
      //logger.stInf('Usuário logado:', user, token);
    },

    async logout() {
      await authService.logout()
      this.clearSession()
      router.push('/')
    },

    clearSession() {
      this.user = null
      this.token = null
      localStorage.clear()
      this.stopTokenRefreshInterval()
    },

    startTokenRefreshInterval() {
      this.stopTokenRefreshInterval() // previne duplicidade
      this.refreshInterval = setInterval(
        async () => {
          const success = await this.refreshToken()
          if (!success) {
            await this.logout()
          }
        },
        50 * 60 * 1000,
      ) // 50 minutos
    },

    stopTokenRefreshInterval() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
        this.refreshInterval = null
      }
    },

    async refreshToken() {
      // Tenta renovar o token chamando o serviço de autenticação
      // Se falhar, captura o erro e retorna um objeto vazio ({})
      const { token, user } = await authService.refreshToken().catch(() => ({}))
      // Se obteve token, atualiza o usuário e token na store
      if (token) {
        this.user = user
        this.token = token
        return true
      }
      // Se não houver token, faz logout e retorna false
      await this.logout()
      return false
    },
  },
})
