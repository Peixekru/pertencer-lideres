<template>
  <v-container class="text-center">
    <h2 class="mb-4">Escolher Tema</h2>

    <v-btn
      v-for="key in themeKeys"
      :key="key"
      class="ma-2"
      :color="isSelected(key) ? 'primary' : 'secondary'"
      variant="elevated"
      @click="changeTheme(key)"
    >
      {{ key }}
    </v-btn>
  </v-container>
</template>


<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/store/settings'
import { useThemeSwitcher } from '@/composables/useVuetifyDynamicColors'

const settingsStore = useSettingsStore()
const { applyTheme } = useThemeSwitcher()

const themeKeys = computed(() => settingsStore.themeKeys)
const isSelected = (key) => settingsStore.selectedThemeKey === key

const changeTheme = async (key) => {
  if (!isSelected(key)) {
    //applyTheme(key) // aplica no frontend (Vuetify)
    await settingsStore.updateSelectedThemeInDB(key) // envia pro backend
  }
}
</script>