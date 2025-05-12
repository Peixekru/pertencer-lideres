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

    // --------------------------------
    // Getters
    // --------------------------------

    // Retorna o progresso total do curso em %
    const courseProgress = computed(() => progressData.value?.course_progress || 0)
    // Retorna todas as unidades com progresso detalhado
    const unitsWithProgress = computed(() => progressData.value?.units || [])
    // Retorna uma unidade com progresso pelo ID
    const getUnitProgressById = (unitId) => {
      return unitsWithProgress.value.find((u) => u.id === unitId) || null
    }

    // --------------------------------
    // Actions
    // --------------------------------

    // Obtém o progresso do curso
    async function fetchCourseProgress(courseId) {
      startLoading()
      try {
        const authStore = useAuthStore()
        // Obtém o ID do usuário
        const userId = authStore.user?.id
        // Verifica se o ID do usuário está disponível
        if (!userId || !courseId) {
          throw new Error('Dados do usuário ou curso ausentes.')
        }
        // Faz a chamada à API para obter o progresso do curso
        const response = await api.get(`/users/${userId}/courses/${courseId}/progress`)
        // Atualiza o estado com os dados do progresso
        progressData.value = response.data
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
    // Erro tratado e formatado
    function handleError(err) {
      console.error('Erro ao carregar progresso:', err)
      error.value = err?.response?.data?.message || err.message || 'Erro desconhecido.'
    }

    // --------------------------------
    // Exposição
    // --------------------------------

    // Retorna o estado e ações
    return {
      progressData,
      loading,
      error,
      courseProgress,
      unitsWithProgress,
      getUnitProgressById,
      fetchCourseProgress,
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
