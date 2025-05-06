import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { getCookie } from './utils/cookie';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// 👉 Limpeza do usuário se não existir refreshToken
const refreshToken = getCookie('refreshToken');
if (!refreshToken) {
  localStorage.clear(); // limpa tudo
  //router.push('/'); // redireciona para login
  //localStorage.removeItem('user');
  //localStorage.removeItem('access_token'); // Adicional: também remove o token
}


const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // Plugin de persistência no Pinia

app.use(pinia);
app.use(router);
app.use(vuetify);

app.mount('#app');
