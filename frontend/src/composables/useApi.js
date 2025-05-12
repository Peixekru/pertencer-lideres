import axios from 'axios'
import { useAuthStore } from '@/store/auth'
import { getActivePinia } from 'pinia'
import { getCookie } from '@/utils/cookie'

// Base da API definida no .env
const API_BASE = import.meta.env.VITE_API_URL

// Criação da instância do Axios com configuração base
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Envia cookies (ex: refreshToken)
})

/**
 * Interceptor de requisição:
 * Injeta o token JWT no header Authorization antes de cada requisição
 */
api.interceptors.request.use((config) => {
  const authStore = useAuthStore(getActivePinia())
  const token = authStore.token?.value

  token && (config.headers.Authorization = `Bearer ${token}`)

  return config
})

/**
 * Interceptor de resposta:
 * Se o token estiver expirado (401), tenta renová-lo automaticamente
 */
api.interceptors.response.use(
  (response) => response, // Se resposta for OK, retorna direto
  async (error) => {
    const originalRequest = error.config

    // Se for erro 401 e ainda não tentamos renovar o token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // Marca que já tentamos

      const authStore = useAuthStore(getActivePinia())
      const hasRefreshToken = getCookie('refreshToken') // Verifica se há cookie

      // Se não houver refreshToken, encerra a sessão
      if (!hasRefreshToken) {
        await authStore.logout()
        return Promise.reject(error)
      }

      try {
        // Tenta renovar o token com a rota /refresh-token
        const { data } = await axios.post(
          `${API_BASE}/refresh-token`,
          {},
          { withCredentials: true },
        )

        // Atualiza a store com novo token e usuário
        authStore.token.value = data.token
        authStore.user.value = data.user

        // Atualiza o header da requisição original e reenvia
        originalRequest.headers.Authorization = `Bearer ${data.token}`
        return api(originalRequest)
      } catch (refreshError) {
        // Se falhar ao renovar, faz logout
        await authStore.logout()
        return Promise.reject(refreshError)
      }
    }
    // Qualquer outro erro segue normalmente
    return Promise.reject(error)
  },
)

export default api
