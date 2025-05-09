import { defineStore } from 'pinia'
import { useUserCoursesStore } from './userCourses'
import api from '@/services/api'

export const useUnitStore = defineStore('unit', {
  state: () => ({
    units: [],
    loading: false,
    error: null,
  }),

  persist: {
    storage: localStorage,
    pick: ['units'],
  },

  actions: {
    async fetchUnits() {
      this.startLoading()
      try {
        const userCoursesStore = useUserCoursesStore()
        const userCourseId = userCoursesStore.firstCourse?.user_course_id
        if (!userCourseId) {
          throw new Error('Nenhum userCourseId encontrado.')
        }
        const response = await api.get(`/units/${userCourseId}`)
        this.units = response.data
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
