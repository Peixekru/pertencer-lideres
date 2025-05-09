import { defineStore } from 'pinia'
import api from '@/services/api'

export const useUserCoursesStore = defineStore('userCourses', {
  state: () => ({
    userCourses: [],
    firstCourse: null,
    loading: false,
    error: null,
  }),

  persist: {
    storage: localStorage,
    paths: ['userCourses', 'firstCourse'],
  },

  actions: {
    async fetchUserCourses(userId) {
      this.startLoading()
      try {
        const response = await api.get(`/users/${userId}/courses`)
        // Seleciona a lista de cursos do usuário
        this.userCourses = response.data
        //Seleciona o primeiro curso da lista de cursos do usuário
        this.firstCourse = this.userCourses[0]
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
      console.error('Erro ao buscar cursos do usuário:', error)
      this.error = this.formatError(error)
    },

    formatError(error) {
      if (error?.response?.data?.message) return error.response.data.message
      if (error?.message) return error.message
      return 'Erro desconhecido. Tente novamente.'
    },
  },
})
