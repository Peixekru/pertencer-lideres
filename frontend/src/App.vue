<template>
  <component :is="layout">
    <v-app>
      <RouterView />
    </v-app>
  </component>
</template>

<script setup>
import { watch, watchEffect, computed } from 'vue'
// importa o router
import { useRoute } from 'vue-router'
// importa stores
import { useSettingsStore } from '@/store/settings'
import { useThemeSwitcher } from '@/composables/useVuetifyDynamicColors'
// importa o layout padrão
import DefaultLayout from '@/layouts/DefaultLayout.vue'
// importa o modal global

// inicializadores
const route = useRoute()
const settingsStore = useSettingsStore()
const { applyTheme } = useThemeSwitcher()

// Verifica se o layout default deve ser renderizado
const layout = computed(() => {
  return route.meta.noLayout ? 'div' : DefaultLayout
})

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
  document.documentElement.classList.toggle('theme-mono', isMono)
})
</script>

<style lang="scss">
// importa o scss global
@use '@/assets/styles/global.scss' as *;
</style>
