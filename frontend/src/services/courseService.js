import http from '@/services/api';

const courseService = {
  async fetchUserCourses(userId) {
    const { data } = await http.get(`/users/${userId}/courses`);
    return data;
  },

  async fetchUserCourseDetails(userCourseId) {
    const { data } = await http.get(`/user-courses/${userCourseId}/course`);
    return data;
  },
};

export default courseService;