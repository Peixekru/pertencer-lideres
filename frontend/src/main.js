// Core Vue Imports
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// App Root
import App from './App.vue'

// Router & State Management
import router from './router'
import { useAuthStore } from '@/store/auth'
import { useSettingsStore } from '@/store/settings'

// Vuetify + Theme Utils
import vuetify, { applyDynamicTheme } from './plugins/vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// Persistência de Estado
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Cria a instância da aplicação Vue
const app = createApp(App)

// Configura o Pinia com persistência
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Registra os plugins
app.use(pinia)
app.use(router)
app.use(vuetify)

// Inicializa o tema dinâmico com base nas preferências salvas
const settingsStore = useSettingsStore(pinia)
const themeKey = settingsStore.selectedThemeKey
const themeData = settingsStore.themeByKey(themeKey)

if (themeData?.colors && typeof themeData.dark === 'boolean') {
  applyDynamicTheme(vuetify, themeKey, themeData)
}

// Inicializa a store de autenticação
const authStore = useAuthStore(pinia)

// Função para montar a aplicação
const startApp = () => {
  router.isReady().then(() => app.mount('#app'))
}

// Fluxo de inicialização com verificação de token
if (authStore.token) {
  authStore.refreshToken().finally(startApp)
} else {
  startApp()
}
