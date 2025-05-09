import { defineStore } from 'pinia'
import api from '@/services/api'

export const useLessonStore = defineStore('lesson', {
  state: () => ({
    lessons: [],
    loading: false,
    error: null,
  }),

  persist: {
    storage: localStorage,
    pick: ['lessons'],
  },

  actions: {
    async fetchLessons(unitId) {
      this.startLoading()
      try {
        const response = await api.get(`/lessons/${unitId}`)
        this.lessons = response.data
      } catch (error) {
        this.handleError(error)
      } finally {
        this.stopLoading()
      }
    },

    startLoading() {
      this.loading = true
      this.error = null
    },

    stopLoading() {
      this.loading = false
    },

    handleError(error) {
      console.error('Erro capturado:', error)
      this.error = this.formatError(error)
    },

    formatError(error) {
      if (error?.response?.data?.message) {
        return error.response.data.message
      }
      if (error?.message) {
        return error.message
      }
      return 'Erro desconhecido. Tente novamente.'
    },
  },
})
