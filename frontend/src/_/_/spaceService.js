import api from './api'

export default {
  async fetch(slug) {
    const response = await api.get(`/space/${slug}`)
    return response.data
  },
}
