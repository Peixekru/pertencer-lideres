// src/store/course.js
import { defineStore } from 'pinia'
import axios from '@/services/axiosInstance'

export const useCourseStore = defineStore('course', {
  state: () => ({
    userCourses: [],
    currentCourse: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUserCourses(userId) {
      const { data } = await axios.get(`/users/${userId}/courses`)
      this.userCourses = data
      return data
    },

    async fetchUserCourseDetails(userCourseId) {
      const { data } = await axios.get(`/user-courses/${userCourseId}/course`)
      this.userCourseDetails = data
      this.currentCourse = data
      return data
    }
  },

  //router.get('/user-courses/:userCourseId/course', getUserCourse);
})
