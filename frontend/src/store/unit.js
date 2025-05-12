import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserCoursesStore } from './userCourses'
import api from '@/composables/useApi'
import { getUrl } from '@/utils/url'
import { getPlaceholder, size } from '@/utils/placeholder'

export const useUnitStore = defineStore(
  'unit',
  () => {
    // Estado reativo
    const units = ref([])
    const loading = ref(false)
    const error = ref(null)

    // -------------------------------
    // Getters (em formato computed)
    // -------------------------------

    // Ordena unidades por ordem definida
    const unitsByOrder = computed(() => {
      return [...units.value].sort((a, b) => a.order_index - b.order_index)
    })
    // Retorna título da unidade por ID
    const getTitleByUnitId = (unitId) => {
      return units.value.find((u) => u.id === unitId)?.title || ''
    }
    // Retorna a imagem completa da unidade (com fallback)
    const getImageByUnitId = (unitId) => {
      const image = units.value.find((u) => u.id === unitId)?.image_url
      return getUrl(image, getPlaceholder(size.icon))
    }
    // Retorna unidade completa pelo ID
    const getUnitById = (unitId) => {
      return units.value.find((u) => u.id === unitId) || null
    }
    // Banner no topo (pode ser o da primeira unidade ou um padrão)
    const headerImageUrl = computed(() => {
      const firstImage = units.value[0]?.image_url
      return getUrl(firstImage, getPlaceholder(size.branding))
    })

    // -------------------------------
    // Actions
    // -------------------------------

    // Busca unidades do curso
    async function fetchUnits() {
      startLoading()
      try {
        const userCoursesStore = useUserCoursesStore()
        // Obtém ID do primeiro curso do usuário
        const userCourseId = userCoursesStore.firstCourse?.user_course_id
        // Verifica se há ID do curso
        if (!userCourseId) {
          throw new Error('Nenhum userCourseId encontrado.')
        }
        // Faz requisição para buscar unidades
        const response = await api.get(`/units/${userCourseId}`)
        // Atualiza estado com unidades
        units.value = response.data
      } catch (err) {
        handleError(err)
      } finally {
        stopLoading()
      }
    }
    // Icializa estado de carregamento
    function startLoading() {
      loading.value = true
      error.value = null
    }
    // Finaliza estado de carregamento
    function stopLoading() {
      loading.value = false
    }
    // Trata e formata erros da requisição
    function handleError(err) {
      console.error('Erro ao buscar unidades:', err)
      error.value = formatError(err)
    }
    // Formata mensagem de erro
    function formatError(err) {
      if (err?.response?.data?.message) return err.response.data.message
      if (err?.message) return err.message
      return 'Erro desconhecido. Tente novamente.'
    }

    // -------------------------------
    // Exposição
    // -------------------------------

    // Exporta funções e estado
    return {
      units,
      loading,
      error,
      fetchUnits,
      unitsByOrder,
      getTitleByUnitId,
      getImageByUnitId,
      getUnitById,
      headerImageUrl,
    }
  },
  {
    // Persistência no localStorage
    persist: {
      storage: localStorage,
      paths: ['units'],
    },
  },
)
