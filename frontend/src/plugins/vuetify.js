import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Criação da instância do Vuetify com temas padrão
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#FFFFFF',
        },
      },
    },
  },
})

/*
 * Aplica um tema customizado dinamicamente ao Vuetify
 * @param {object} vuetifyInstance - Instância do Vuetify (ex: app._context.provides.vuetify)
 * @param {string} themeKey - Nome da chave do tema ("light", "dark", etc)
 * @param {object} themeData - Objeto do tema com { dark: boolean, colors: { ... } }
 */

export function applyDynamicTheme(vuetifyInstance, themeKey, themeData) {
  if (!vuetifyInstance?.theme || !themeData?.colors) {
    console.warn('Vuetify instance ou tema inválido:', vuetifyInstance, themeData)
    return
  }

  // Clona variáveis do tema base original para manter comportamentos como hover, ripple etc.
  const baseThemeKey = themeData.dark ? 'dark' : 'light'
  const baseTheme = vuetifyInstance.theme.themes.value[baseThemeKey]
  const baseVariables = baseTheme?.variables || {}

  // Define o novo tema customizado
  vuetifyInstance.theme.themes.value.customTheme = {
    dark: themeData.dark,
    colors: themeData.colors,
    variables: {
      ...baseVariables,
    },
  }

  // Aplica o novo tema globalmente
  vuetifyInstance.theme.global.name.value = 'customTheme'
  console.info(`Tema dinâmico '${themeKey}' aplicado.`)
}

export default vuetify
