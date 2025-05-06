import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import logger from '#logger'

// Define as rotas da aplicação
const routes = [
  {
    path: '/', // Rota raiz
    name: 'Login',
    component: () => import('@/views/LoginView.vue') // Lazy loading do componente
  },
  {
    path: '/Home', // Rota da página principal
    name: 'Home',
    component: () => import('@/views/HomeView.vue'), // Lazy loading do componente
    meta: { requiresAuth: true } // 🔒 Rota protegida (requer autenticação)
  }
];

// Cria a instância do roteador Vue
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Configura o modo de histórico
  routes // Define as rotas
});

// 🔐 Middleware global de autenticação
// Executado antes de cada navegação
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore(); // Acessa o store de autenticação

  // Verifica se a rota requer autenticação
  if (to.meta.requiresAuth) {
    // Se não tem usuário logado ou token expirado, tenta renovar
    if (!authStore.user) {
      const refreshed = await authStore.refreshToken();
      if (!refreshed) {
        authStore.logout(); // Faz logout se não conseguir renovar
        return next({ name: 'Login' });  // Redireciona para login
      }
      // Re-hidrata o usuário do storage após renovar o token
      authStore.hydrate();
    }
  }
  next(); // Continua a navegação
});

export default router;
