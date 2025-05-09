<template>
  <v-app>
    <RouterView />
  </v-app>
</template>

<script setup>
import { watch, watchEffect } from 'vue'
import { useSettingsStore } from '@/store/settings'
import { useThemeSwitcher } from '@/composables/vuetifyDynamicColors'

const settingsStore = useSettingsStore()
const { applyTheme } = useThemeSwitcher()

// Aplica o tema selecionado ao modificar o settingsStore
watch(
  () => settingsStore.selectedThemeKey,
  (newKey) => {
    if (settingsStore.themeByKey(newKey)?.colors) {
      applyTheme(newKey)
    }
  }
)

// Aplica o filtro de escala de cinza ao modificar o settingsStore
watchEffect(() => {
  const isMono = ['light_mono', 'dark_mono'].includes(settingsStore.selectedThemeKey)
  document.body.classList.toggle('grayscale-filter', isMono)
})
</script>

<style lang="scss">
@use '@/assets/styles/global.scss' as *;
</style>
