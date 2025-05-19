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

import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/composables/useApi'
import { useProgressStore } from './progress'
import { useAuthStore } from './auth'
import { useCourseStore } from './course'

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
        const authStore = useAuthStore()
        const progressStore = useProgressStore()
        const courseStore = useCourseStore()

        const userId = authStore.user?.id
        const courseId = courseStore.currentCourse?.id

        await api.post(`/lessons/${lessonId}/complete`, { userId })
        await progressStore.fetchCourseProgress(courseId)

        return true
      } catch (err) {
        handleError(err)
        return false
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
