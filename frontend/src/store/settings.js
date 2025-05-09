import { defineStore } from 'pinia'
import { useUserCoursesStore } from './userCourses'
import api from '@/services/api'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: null, // Armazena configurações visuais da plataforma
    selectedThemeKey: 'light', // Tema selecionado pelo usuário
  }),

  // Persistência no localStorage
  persist: {
    storage: localStorage,
    paths: ['settings', 'selectedThemeKey'],
  },

  getters: {
    // Retorna apenas as cores do tema atual
    currentTheme(state) {
      return state.settings?.colorThemes?.[state.selectedThemeKey]?.colors || {}
    },

    // Verifica se o tema atual é escuro
    isDark(state) {
      return state.settings?.colorThemes?.[state.selectedThemeKey]?.dark || false
    },

    // Retorna as configurações completas de um tema específico
    themeByKey: (state) => (key) => {
      return state.settings?.colorThemes?.[key] || {}
    },

    // Lista todas as chaves de temas disponíveis
    themeKeys(state) {
      return Object.keys(state.settings?.colorThemes || {})
    },

    // URLs de branding
    headerLogoUrl(state) {
      return state.settings?.header_logo_url
    },
    headerImageUrl(state) {
      return state.settings?.header_image_url
    },
    headerIcons(state) {
      return state.settings?.header_icons || {}
    },
  },

  actions: {
    // Busca as configurações visuais da API
    async fetchSettings() {
      const userCoursesStore = useUserCoursesStore()
      const userCourseId = userCoursesStore.firstCourse?.user_course_id

      const response = await api.get(`/settings/${userCourseId}`)

      this.settings = {
        colorThemes: response.data.colorThemes,
        header_icons: response.data.header_icons,
        header_logo_url: response.data.header_logo_url,
        header_image_url: response.data.header_image_url,
      }

      this.selectedThemeKey = response.data.selectedThemeKey || 'light'
    },

    // Atualiza a chave do tema se ele existir
    selectTheme(themeKey) {
      if (this.settings?.colorThemes?.[themeKey]) {
        this.selectedThemeKey = themeKey
      }
    },
    // atualiza
    async updateSelectedThemeInDB(themeKey) {
      const userCoursesStore = useUserCoursesStore()
      const userCourseId = userCoursesStore.firstCourse?.user_course_id

      if (!this.settings?.colorThemes?.[themeKey]) {
        console.warn(`Tema '${themeKey}' não encontrado.`)
        return
      }

      this.selectedThemeKey = themeKey

      try {
        await api.put(`/settings/${userCourseId}`, {
          selectedThemeKey: themeKey,
        })
        console.info(`Tema '${themeKey}' salvo no backend com sucesso.`)
      } catch (error) {
        console.error('Erro ao salvar tema no backend:', error)
      }
    },
  },
})
