// src/services/axiosInstance.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Altere para o endereço da sua API
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
