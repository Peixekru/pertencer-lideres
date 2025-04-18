import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { getCookie } from './utils/cookie';
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// Se não existe o refreshToken, remove o usuário do localStorage
const refreshToken = getCookie('refreshToken');
if (!refreshToken) { localStorage.removeItem('user') }

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')