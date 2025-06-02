/**
 * Responsável por:
 * - Buscar os detalhes de uma ou mais lições
 * - Controlar estado local de lições (lessons)
 * - Marcar lição como concluída (completeLesson)
 * - Gerenciar estado de carregamento e erros
 *
 * Observações:
 * - Atualização do progresso é feita via progressStore
 * - Assume que authStore e courseStore estão prontos no contexto
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import api from '@/composables/useApi'

export const useLessonStore = defineStore(
  'lesson',
  () => {
    // Estado reativo
    const lessons = ref([])
    const lessonDetails = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Busca todas as lições de uma unidade específica
    async function fetchLessons(unitId) {
      startLoading()
      try {
        // /lessons/:unitId usa o middleware verifyLessonsFromUnit
        const response = await api.get(`/lessons/${unitId}`)
        console.log(`Conteúdos verificados na unidade com id: ${unitId}`)
        return response.data
      } catch (err) {
        handleError(err)
        return []
      } finally {
        stopLoading()
      }
    }

    // Busca detalhes de uma lição específica
    async function fetchLessonDetails(unitId, lessonId) {
      startLoading()
      try {
        // Recarrega as lições se estiverem vazias ou de outra unidade
        const hasLessonsFromOtherUnit =
          !lessons.value.length || lessons.value[0]?.unit_id !== unitId
        if (hasLessonsFromOtherUnit) {
          await fetchLessons(unitId)
        }
        // Busca detalhes da lição específica
        lessonDetails.value = lessons.value.find((l) => l.id === lessonId) || null
        return lessonDetails.value
      } catch (err) {
        handleError(err)
        return null
      } finally {
        stopLoading()
      }
    }

    // Marca uma lição como concluída e atualiza progresso
    async function completeLesson(lessonId) {
      try {
        // Utiliza a store de autenticação para obter o ID do usuário
        const authStore = useAuthStore()
        const userId = authStore.user?.id
        // Atualiza a lição recebida com o id do usuário
        await api.post(`/lessons/${lessonId}/complete`, { userId })
        // retorna true se a atualização for bem-sucedida
        return true
      } catch (err) {
        handleError(err)
        return false
      }
    }

    // Avaliza uma lição
    async function rateLesson(lessonId, rating) {
      try {
        await api.patch(`/lessons/${lessonId}/rating`, { rating })
        console.log('Rating enviado com sucesso:', rating)
      } catch (err) {
        console.error('Erro ao enviar rating:', err)
      }
    }

    // Carrega as lições de múltiplas unidades desbloqueadas
    // - Usa Promise.all para buscar em paralelo
    // - Junta os resultados em um único array (flatten) para exibir badges e lições em ordem global
    async function preloadLessonsForUnits(units) {
      const results = await Promise.all(units.map((u) => fetchLessons(u.id)))
      lessons.value = results.flat()
    }

    // Controle de loading e erro
    function startLoading() {
      loading.value = true
      error.value = null
    }
    function stopLoading() {
      loading.value = false
    }
    function handleError(err) {
      console.error('Erro na lessonStore:', err)
      error.value = formatError(err)
    }
    function formatError(err) {
      if (err?.response?.data?.message) return err.response.data.message
      if (err?.message) return err.message
      return 'Erro desconhecido. Tente novamente.'
    }

    // Exporta funções e estado
    return {
      lessons,
      lessonDetails,
      loading,
      error,
      fetchLessons,
      fetchLessonDetails,
      completeLesson,
      rateLesson,
      preloadLessonsForUnits,
    }
  },
  {
    // Persiste apenas os dados de lições já carregadas.
    // Ideal para manter estado ao navegar entre rotas ou ao recarregar a SPA.
    persist: {
      storage: localStorage,
      paths: ['lessons', 'lessonDetails'],
    },
  },
)
