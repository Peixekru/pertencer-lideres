import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserCoursesStore } from './userCourses'
import { getPlaceholder, size } from '@/utils/placeholder'
import { getUrl } from '@/utils/url'
import api from '@/composables/useApi'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    // Estado reativo
    const settings = ref(null)
    const selectedThemeKey = ref('light')

    // -----------------------------------
    // Computed getters
    // -----------------------------------

    // Cores do tema atual
    const currentTheme = computed(
      () => settings.value?.colorThemes?.[selectedThemeKey.value]?.colors || {},
    )
    // Verifica se o tema atual é escuro
    const isDark = computed(
      () => settings.value?.colorThemes?.[selectedThemeKey.value]?.dark || false,
    )
    // Lista todas as chaves de temas disponíveis
    const themeKeys = computed(() => Object.keys(settings.value?.colorThemes || {}))
    // Busca um tema específico pela chave
    const themeByKey = (key) => {
      return settings.value?.colorThemes?.[key] || {}
    }
    // URL do logo principal (header)
    const headerLogoUrl = computed(() =>
      getUrl(settings.value?.header_logo_url, getPlaceholder(size.header)),
    )
    // URL do banner principal (header)
    const headerImageUrl = computed(() =>
      getUrl(settings.value?.header_image_url, getPlaceholder(size.branding)),
    )
    // Ícones usados no header (ex: info, sair, acesso)
    const headerIcons = computed(() => {
      const icons = settings.value?.header_icons || {}
      return {
        exit: getUrl(icons.exit_icon_url, getPlaceholder(size.icon)),
        info: getUrl(icons.info_icon_url, getPlaceholder(size.icon)),
        access: getUrl(icons.access_icon_url, getPlaceholder(size.icon)),
      }
    })

    // -----------------------------------
    // Actions
    // -----------------------------------

    // Busca as configurações visuais da API
    async function fetchSettings() {
      const userCoursesStore = useUserCoursesStore()
      // Obtém o ID do primeiro curso do usuário
      const userCourseId = userCoursesStore.firstCourse?.user_course_id
      // Faz a requisição à API
      const { data } = await api.get(`/settings/${userCourseId}`)
      // Atualiza o estado com as configurações visuais
      settings.value = {
        colorThemes: data.colorThemes,
        header_icons: data.header_icons,
        header_logo_url: data.header_logo_url,
        header_image_url: data.header_image_url,
      }
      // Atualiza o tema selecionado
      selectedThemeKey.value = data.selectedThemeKey || 'light'
    }
    // Altera o tema selecionado no frontend
    function selectTheme(themeKey) {
      if (settings.value?.colorThemes?.[themeKey]) {
        selectedThemeKey.value = themeKey
      }
    }
    // Atualiza o tema selecionado no backend
    async function updateSelectedThemeInDB(themeKey) {
      const userCoursesStore = useUserCoursesStore()
      // Obtém o ID do primeiro curso do usuário
      const userCourseId = userCoursesStore.firstCourse?.user_course_id
      // Verifica se o tema existe
      if (!settings.value?.colorThemes?.[themeKey]) {
        console.warn(`Tema '${themeKey}' não encontrado.`)
        return
      }
      // Atualiza o tema selecionado
      selectedThemeKey.value = themeKey
      // Salva o tema no backend
      try {
        await api.put(`/settings/${userCourseId}`, {
          selectedThemeKey: themeKey,
        })
        console.info(`Tema '${themeKey}' salvo no backend com sucesso.`)
      } catch (error) {
        console.error('Erro ao salvar tema no backend:', error)
      }
    }

    // -----------------------------------
    // Exporta variáveis e funções
    // -----------------------------------

    return {
      settings,
      selectedThemeKey,
      currentTheme,
      isDark,
      themeKeys,
      themeByKey,
      headerLogoUrl,
      headerImageUrl,
      headerIcons,
      fetchSettings,
      selectTheme,
      updateSelectedThemeInDB,
    }
  },
  {
    persist: {
      storage: localStorage,
      paths: ['settings', 'selectedThemeKey'],
    },
  },
)
