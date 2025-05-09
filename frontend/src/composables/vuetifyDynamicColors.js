import { useTheme } from 'vuetify'
import { useSettingsStore } from '@/store/settings'

export function useThemeSwitcher() {
  // Acessa o tema atual do Vuetify
  const vuetifyTheme = useTheme()

  // Acessa as configurações armazenadas (temas, cores, etc)
  const settingsStore = useSettingsStore()

  //Aplica um tema dinâmico com base em uma chave (ex: 'dark_mono')
  function applyTheme(themeKey) {
    const themeConfig = settingsStore.themeByKey(themeKey)

    // Validação de segurança: evita temas inexistentes ou malformados
    if (!themeConfig || !themeConfig.colors) {
      console.warn('❌ Tema inválido ou não encontrado:', themeKey)
      return
    }

    const isDark = !!themeConfig.dark
    const colors = themeConfig.colors

    // Seleciona o tema base padrão (light ou dark) para herdar variáveis
    const baseThemeKey = isDark ? 'dark' : 'light'
    const baseTheme = vuetifyTheme.themes.value[baseThemeKey]
    const baseVariables = baseTheme?.variables || {}

    // Aplica o tema customizado com extensão das variáveis do tema base
    vuetifyTheme.themes.value.customTheme = {
      dark: isDark,
      colors,
      variables: { ...baseVariables },
    }

    // Atualiza o tema global usado pelo Vuetify
    vuetifyTheme.global.name.value = 'customTheme'

    // Atualiza a store com o tema selecionado
    settingsStore.selectTheme(themeKey)

    console.info(`🎨 Tema '${themeKey}' aplicado com sucesso.`)
  }

  return {
    applyTheme,
  }
}
