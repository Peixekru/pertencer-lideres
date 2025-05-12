import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/composables/useApi'

export const useLessonStore = defineStore(
  'lesson',
  () => {
    // Estado reativo
    const lessons = ref([])
    const loading = ref(false)
    const error = ref(null)

    // Busca todas as lições de uma unidade específica
    async function fetchLessons(unitId) {
      startLoading()
      try {
        // Realiza a requisição para lesões passando o ID da unidade
        const response = await api.get(`/lessons/${unitId}`)
        // Atualiza o estado com as lições
        lessons.value = response.data
        // Retorna as lições
        return response.data
      } catch (err) {
        handleError(err)
        return []
      } finally {
        stopLoading()
      }
    }

    // Inicia estado de carregamento
    function startLoading() {
      loading.value = true
      error.value = null
    }
    // Finaliza carregamento
    function stopLoading() {
      loading.value = false
    }
    // Erro tratado e formatado
    function handleError(err) {
      console.error('Erro ao buscar lições:', err)
      error.value = formatError(err)
    }
    // Formata o erro para exibição ou log
    function formatError(err) {
      if (err?.response?.data?.message) return err.response.data.message
      if (err?.message) return err.message
      return 'Erro desconhecido. Tente novamente.'
    }
    // Exporta funções e estado
    return {
      lessons,
      loading,
      error,
      fetchLessons,
    }
  },
  {
    // Persiste o estado no localStorage
    persist: {
      storage: localStorage,
      paths: ['lessons'],
    },
  },
)
