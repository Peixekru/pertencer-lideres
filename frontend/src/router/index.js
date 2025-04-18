import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import logger from '#logger'

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
    meta: { requiresAuth: true } // 🔒 Rota protegida
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// 🔐 Middleware global de autenticação
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    // Se não tem user ou token expirou, tenta renovar
    if (!authStore.user) {
      logger.log(authStore.user)
      const refreshed = await authStore.refreshToken();
      logger.log('token - refreshToken vindo do router')

      if (!refreshed) {
        authStore.logout();
        return next({ name: 'Login' });  // Garante que o usuário será redirecionado ao login
      }

      // Re-hidrata o user do storage após renovar
      authStore.hydrate();
      logger.log('Re-hidrata user após refreshToken', authStore.user, authStore.token)
    }
  }
  next();
});

export default router;
