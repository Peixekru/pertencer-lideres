import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1976D2',   // Azul principal (ações primárias)
          secondary: '#424242', // Cinza escuro (elementos secundários)
          accent: '#82B1FF',    // Azul claro (destaques)
          error: '#FF5252',     // Vermelho (erros)
          info: '#2196F3',      // Azul informação (notificações)
          success: '#4CAF50',   // Verde (sucesso)
          warning: '#FFC107',   // Âmbar (alertas)
          background: '#FFFFFF' // Branco (fundo do tema claro)
        }
      },
      dark: {
        colors: {
          primary: '#2196F3',    // Azul vibrante (botões principais)
          secondary: '#37474F',  // Cinza-azulado (elementos secundários)
          accent: '#FF4081',     // Rosa (destaques)
          error: '#CF6679',      // Vermelho suavizado (erros)
          info: '#2196F3',       // Azul (informações)
          success: '#00E676',    // Verde neon (sucesso)
          warning: '#FF9100',    // Laranja (alertas)
          background: '#121212'  // Preto quase sólido (fundo escuro)
        }
      }
    },
    defaultTheme: 'dark'
  }
})