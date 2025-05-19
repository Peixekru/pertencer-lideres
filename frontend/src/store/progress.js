/**
 * Responsável por:
 * - Buscar o progresso do curso de um usuário
 * - Armazenar unidades e lições com status de conclusão
 * - Fornecer utilitários para acessar lições e unidades por ID
 *
 * Observações:
 * - Depende de authStore para recuperar o ID do usuário
 * - Persistência automática do progresso em localStorage
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import api from '@/composables/useApi'

export const useProgressStore = defineStore(
  'progress',
  () => {
    // Estado reativo principal
    const progressData = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Getters

    // Retorna o progresso total do curso em %
    const courseProgress = computed(() => progressData.value?.course_progress || 0)
    // Retorna todas as unidades com progresso detalhado
    const unitsWithProgress = computed(() => progressData.value?.units || [])
    // Retorna uma unidade com progresso pelo ID
    const getUnitProgressById = (unitId) => {
      return unitsWithProgress.value.find((u) => u.id === unitId) || null
    }
    // Retorna uma lição pelo ID
    function getLessonById(lessonId) {
      for (const unit of progressData.value?.units || []) {
        const lesson = unit.lessons?.find((l) => l.id === lessonId)
        if (lesson) return lesson
      }
      return null
    }
    // Retorna o ID da unidade que contém uma lição
    function getUnitIdByLessonId(lessonId) {
      return progressData.value?.units?.find((u) => u.lessons?.some((l) => l.id === lessonId))?.id
    }

    // Actions

    // Obtém o progresso do curso
    async function fetchCourseProgress(courseId) {
      startLoading()
      try {
        const authStore = useAuthStore()
        const userId = authStore.user?.id
        if (!userId || !courseId) throw new Error('Dados do usuário ou curso ausentes.')

        const response = await api.get(`/users/${userId}/courses/${courseId}/progress`)
        progressData.value = response.data
      } catch (err) {
        handleError(err)
      } finally {
        stopLoading()
      }
    }

    // Utilitários internos
    function startLoading() {
      loading.value = true
      error.value = null
    }
    function stopLoading() {
      loading.value = false
    }
    function handleError(err) {
      console.error('Erro ao carregar progresso:', err)
      error.value = err?.response?.data?.message || err.message || 'Erro desconhecido.'
    }

    // Exposição
    return {
      progressData,
      loading,
      error,
      courseProgress,
      unitsWithProgress,
      getUnitProgressById,
      fetchCourseProgress,
      getLessonById,
      getUnitIdByLessonId,
    }
  },
  {
    // Persiste o estado no localStorage
    persist: {
      storage: localStorage,
      paths: ['progressData'],
    },
  },
)
