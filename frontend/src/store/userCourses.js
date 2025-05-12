import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/composables/useApi' // Atualize para novo caminho, se necessário

export const useUserCoursesStore = defineStore(
  'userCourses',
  () => {
    // Estado reativo
    const userCourses = ref([])
    const firstCourse = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Requisição para buscar os cursos do usuário
    async function fetchUserCourses(userId) {
      startLoading()
      try {
        const response = await api.get(`/users/${userId}/courses`)
        // Atualiza o estado com os cursos do usuário
        userCourses.value = response.data
        // Atualiza o primeiro curso
        firstCourse.value = userCourses.value[0] || null
      } catch (err) {
        handleError(err)
      } finally {
        stopLoading()
      }
    }
    // Inicia estado de carregamento
    function startLoading() {
      loading.value = true
      error.value = null
    }
    // Finaliza estado de carregamento
    function stopLoading() {
      loading.value = false
    }
    // Trata e formata erros da requisição
    function handleError(error) {
      console.error('Erro ao buscar cursos do usuário:', error)
      error.value = formatError(error)
    }
    // Formata mensagem de erro
    function formatError(error) {
      if (error?.response?.data?.message) return error.response.data.message
      if (error?.message) return error.message
      return 'Erro desconhecido. Tente novamente.'
    }
    // Exporta funções e estado
    return {
      userCourses,
      firstCourse,
      loading,
      error,
      fetchUserCourses,
    }
  },
  {
    // Persistência no localStorage
    persist: {
      storage: localStorage,
      paths: ['userCourses', 'firstCourse'],
    },
  },
)
