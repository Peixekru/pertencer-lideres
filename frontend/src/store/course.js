import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useUserCoursesStore } from './userCourses'
import { useSettingsStore } from './settings'
import { getUrl } from '@/utils/url'
import api from '@/composables/useApi'

export const useCourseStore = defineStore(
  'course',
  () => {
    // Estado reativo
    const currentCourse = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // -----------------------------------------
    // Ações
    // -----------------------------------------

    // Busca os detalhes do curso do usuário atual
    async function fetchUserCourse() {
      startLoading()
      try {
        const userCoursesStore = useUserCoursesStore()
        // Obtém o ID do primeiro curso do usuário
        const userCourseId = userCoursesStore.firstCourse?.user_course_id
        // Verifica se há um userCourseId válido
        if (!userCourseId) {
          throw new Error('Nenhum userCourseId encontrado.')
        }
        // Faz a requisição para obter os detalhes do curso
        const response = await api.get(`/course/${userCourseId}`)
        // Atualiza o estado com os detalhes do curso
        currentCourse.value = response.data
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

    // Finaliza carregamento
    function stopLoading() {
      loading.value = false
    }

    // Trata e registra erro ocorrido
    function handleError(err) {
      console.error('Erro ao carregar detalhes do curso:', err)
      error.value = formatError(err)
    }

    // Formata o erro para exibição
    function formatError(err) {
      if (err?.response?.data?.message) return err.response.data.message
      if (err?.message) return err.message
      return 'Erro desconhecido. Tente novamente.'
    }

    // -----------------------------------------
    // Getters computados de estilo
    // -----------------------------------------

    // Verifica se há imagem de fundo
    const hasBackgroundImage = computed(() => {
      return !!currentCourse.value?.background_image_url
    })

    // Estilo da camada de cor (gradiente ou cor sólida)
    const backgroundColorStyle = computed(() => {
      // instância do store de configurações
      const settingsStore = useSettingsStore()
      // obtém a referência computada isDark
      const { isDark } = storeToRefs(settingsStore)
      // obtém o curso atual
      const course = currentCourse.value
      // Cor de fallback para cor escura ou clara
      const fallback = isDark.value ? '#1e1e1e' : '#f5f5f5'
      if (!course) return { backgroundColor: fallback }
      // Verifica se há gradiente
      if (course.background_color_1 && course.background_color_2) {
        return {
          // Gradiente linear
          background: `linear-gradient(to bottom, ${course.background_color_1}, ${course.background_color_2})`,
        }
      }
      // Cor sólida
      if (course.background_color_1) {
        return {
          backgroundColor: course.background_color_1,
        }
      }
      // Cor de fallback
      return { backgroundColor: fallback }
    })
    // Estilo da camada de imagem
    const backgroundImageStyle = computed(() => {
      const course = currentCourse.value
      // Sem imagem
      if (!course?.background_image_url) return {}
      // Imagem de fundo
      return {
        backgroundImage: `url(${getUrl(course.background_image_url)})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }
    })
    // Exporta variáveis e funções
    return {
      currentCourse,
      loading,
      error,
      fetchUserCourse,
      hasBackgroundImage,
      backgroundColorStyle,
      backgroundImageStyle,
    }
  },
  {
    // Persistência no localStorage
    persist: {
      storage: localStorage,
      paths: ['currentCourse'],
    },
  },
)
