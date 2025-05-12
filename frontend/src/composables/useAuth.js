import api from '@/composables/useApi' // Instância do Axios com interceptors
import refreshLock from '@/utils/refreshLock' // Evita concorrência entre abas no refresh
import logger from '#logger' // Logger customizado

// Composable com funções de autenticação (login, logout, refresh)
export function useAuth() {
  // Realiza login com usuário e senha e retorna token e usuário
  async function login(login, password) {
    try {
      const { data } = await api.post('/login', { login, password })
      return { user: data.user, token: data.token }
    } catch (error) {
      logger.stErr('Erro no login:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Erro ao fazer login.')
    }
  }
  // Realiza logout limpando sessão no backend
  async function logout() {
    try {
      await api.post('/logout', {}, { withCredentials: true })
    } catch (error) {
      logger.stErr('Erro ao fazer logout:', error.response?.data || error.message)
    }
  }
  // Tenta renovar o token de acesso usando refresh token
  async function refreshToken() {
    // Se outra aba já está fazendo refresh, aguarda terminar
    if (refreshLock.isLocked()) {
      logger.stInf('Aguardando outra aba terminar o refresh...')
      await refreshLock.waitForUnlock()
      return {
        isDone: true,
        token: localStorage.getItem('access_token'), // fallback local
      }
    }
    try {
      // Trava o processo de refresh para outras abas
      refreshLock.setLock()
      // Tenta renovar token usando refresh token
      const { data } = await api.post('/refresh-token', {}, { withCredentials: true })
      // Atualiza token e usuário
      return {
        user: data.user,
        token: data.token,
        isDone: !!data.token, // Confirma se houve sucesso
      }
    } catch (error) {
      logger.stErr('Erro ao renovar token:', error.response?.data || error.message)
      return { isDone: false, token: null }
    } finally {
      // Garante desbloqueio mesmo em caso de erro
      refreshLock.removeLock()
    }
  }
  // Exporta funções para uso em stores ou componentes
  return {
    login,
    logout,
    refreshToken,
  }
}
