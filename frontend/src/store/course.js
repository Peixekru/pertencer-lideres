import { defineStore } from 'pinia'
import { useUserCoursesStore } from './userCourses'
import api from '@/services/api'

export const useCourseStore = defineStore('course', {
  state: () => ({
    currentCourse: null,
    loading: false,
    error: null,
  }),

  persist: {
    storage: localStorage,
    paths: ['currentCourse'],
  },

  actions: {
    async fetchUserCourse() {
      this.startLoading()
      try {
        const userCoursesStore = useUserCoursesStore()
        const userCourseId = userCoursesStore.firstCourse?.user_course_id

        if (!userCourseId) {
          throw new Error('Nenhum userCourseId encontrado.')
        }

        const response = await api.get(`/course/${userCourseId}`)
        this.currentCourse = response.data
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
      console.error('Erro ao carregar detalhes do curso:', error)
      this.error = this.formatError(error)
    },

    formatError(error) {
      if (error?.response?.data?.message) return error.response.data.message
      if (error?.message) return error.message
      return 'Erro desconhecido. Tente novamente.'
    },
  },
})
