import { createRouter, createWebHistory } from 'vue-router'


const routes = [
    {
        path: '/',
        name: 'Login',
        component: () => import('@/views/LoginView.vue')
    },
    {
        path: '/Home',
        name: 'Home',
        component: () => import('@/views/HomeView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router