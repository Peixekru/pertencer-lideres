// Core Vue
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// App Root
import App from './App.vue'

// Router & State
import router from './router'
import { useAuthStore } from '@/store/auth'
import { useSettingsStore } from '@/store/settings'

// Vuetify + Theme
import vuetify, { applyDynamicTheme } from './plugins/vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// Persistência de Estado
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Cria a instância da aplicação Vue
const app = createApp(App)

// Inicializa Pinia com suporte a persistência local
const pinia = createPinia().use(piniaPluginPersistedstate)

// Registra os plugins
app.use(pinia).use(router).use(vuetify)

// Inicializa o tema dinâmico com base nas preferências salvas
const settingsStore = useSettingsStore(pinia)
const themeKey = settingsStore.selectedThemeKey
const themeData = settingsStore.themeByKey(themeKey)

// Aplica o tema dinâmico se houver dados de tema válidos
if (themeData?.colors && typeof themeData.dark === 'boolean') {
  applyDynamicTheme(vuetify, themeKey, themeData)
}

// Inicializa a store de autenticação
const authStore = useAuthStore(pinia)

// Função para montar a aplicação
const startApp = () => router.isReady().then(() => app.mount('#app'))

// Fluxo de inicialização com verificação de token
authStore.token ? authStore.refreshToken().finally(startApp) : startApp()
