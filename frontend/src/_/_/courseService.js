import api from '@/services/api'

const courseService = {
  async fetchUserCourses(userId) {
    const { data } = await api.get(`/users/${userId}/courses`)
    return data
  },

  async fetchUserCourseDetails(userCourseId) {
    const { data } = await api.get(`/user-courses/${userCourseId}/course`)
    return data
  },
}

export default courseService
