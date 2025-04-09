import { createRouter, createWebHistory } from 'vue-router'
//import { getActivePinia } from 'pinia'; // 🔹 Importação correta
import { useAuthStore } from '@/store/auth';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/Home',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true } // 🔹 Define que essa rota precisa de autenticação
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 🔹 Middleware para verificar autenticação antes de acessar uma rota protegida

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    if (!authStore.tokenValid) {
      const refreshed = await authStore.refreshToken(); // 🔹 Tenta renovar o token

      if (!refreshed) {
        return next('/'); // 🔹 Se não conseguir renovar, volta para o login
      }
    }
  }
  next();
})

export default router;
