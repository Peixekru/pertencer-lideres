import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import { useAuth } from '@/composables/useAuth'

// Define a store de autenticação com Composition API
export const useAuthStore = defineStore(
  'auth',
  () => {
    // Estado reativo: armazena dados do usuário, token e intervalo de refresh
    const user = ref(null)
    const token = ref(null)
    const refreshInterval = ref(null)

    // Importa os métodos de autenticação real da camada de serviço (login, logout, refresh)
    const { login: doLogin, logout: doLogout, refreshToken: doRefresh } = useAuth()

    // Realiza login, atualiza o estado da store e inicia o intervalo de refresh
    async function login(login, password) {
      const result = await doLogin(login, password)
      user.value = result.user
      token.value = result.token
      startTokenRefreshInterval()
    }
    // Realiza logout, limpa sessão e redireciona para página inicial
    async function logout() {
      await doLogout()
      clearSession()
      router.push('/')
    }
    // Tenta renovar o token; se falhar, faz logout
    async function refreshToken() {
      const { token: newToken, user: newUser } = await doRefresh().catch(() => ({}))
      if (newToken) {
        user.value = newUser
        token.value = newToken
        return true
      }
      await logout()
      return false
    }
    // Limpa sessão local (estado + localStorage + timer)
    function clearSession() {
      user.value = null
      token.value = null
      localStorage.clear()
      stopTokenRefreshInterval()
    }
    // Inicia um intervalo de 50 minutos para tentar renovar o token
    function startTokenRefreshInterval() {
      stopTokenRefreshInterval() // previne duplicidade
      refreshInterval.value = setInterval(
        async () => {
          const success = await refreshToken()
          if (!success) {
            await logout()
          }
        },
        50 * 60 * 1000, // 50 minutos
      )
    }
    // Para o intervalo de renovação, se existir
    function stopTokenRefreshInterval() {
      if (refreshInterval.value) {
        clearInterval(refreshInterval.value)
        refreshInterval.value = null
      }
    }
    // Exporta os dados e métodos disponíveis da store
    return {
      user,
      token,
      login,
      logout,
      refreshToken,
      clearSession,
      startTokenRefreshInterval,
      stopTokenRefreshInterval,
    }
  },
  {
    // Define persistência local para os campos `user` e `token`
    persist: {
      storage: localStorage,
      paths: ['user', 'token'],
    },
  },
)
