// src/store/courseStore.js
import { defineStore } from 'pinia'
import courseService from '@/services/courseService'

export const useCourseStore = defineStore('courseStore', {
  state: () => ({
    userCourses: [],
    currentCourse: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUserCourses(userId) {
      this.startLoading()
      try {
        const courses = await courseService.fetchUserCourses(userId)
        this.userCourses = courses
      } catch (error) {
        this.handleError(error)
      } finally {
        this.stopLoading()
      }
    },

    async fetchUserCourseDetails(userCourseId) {
      this.startLoading()
      try {
        const course = await courseService.fetchUserCourseDetails(userCourseId)
        this.currentCourse = course
      } catch (error) {
        this.handleError(error)
      } finally {
        this.stopLoading()
      }
    },

    // Helpers para controle de loading e erros
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
