// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'
//import logger from '#logger'

// Define as rotas da aplicação
const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/Home',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/course',
    name: 'Course',
    component: () => import('@/views/CourseView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/units',
    name: 'Units',
    component: () => import('@/views/UnitsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/lessons/:unitId',
    name: 'Lessons',
    component: () => import('@/views/LessonsView.vue'),
    meta: { requiresAuth: true },
    props: true, // permite passar como prop
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Middleware global de autenticação
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Se não há usuário, mas há token salvo, tenta renovar
  if (!authStore.user && authStore.token) {
    await authStore.refreshToken()
  }

  // Se a rota exige autenticação e o usuário continua ausente
  if (to.meta.requiresAuth && !authStore.user) {
    await authStore.logout()
    return next({ name: 'Login' })
  }

  next()
})

export default router
