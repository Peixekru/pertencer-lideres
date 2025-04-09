<template>
  <v-btn
    @click="toggleTheme"
    variant="outlined"
    :prepend-icon="theme.global.name.value === 'dark' ? 'mdi-weather-night' : 'mdi-weather-sunny'"
    class="mb-4"
  >
    `{{ theme.global.name.value }} mode`
  </v-btn>
</template>

<script setup>
  import { useSystemStore } from '@/store/system'
  import { useTheme } from 'vuetify'

  const systemStore = useSystemStore()
  const theme = useTheme()

  function toggleTheme() {
    // Atualiza o estado isDarkMode na store: true se o tema atual for 'light', false caso contrário
    systemStore.isDarkMode = theme.global.name.value === 'light'

    // Define o novo tema com base no valor de isDarkMode: 'dark' se true, 'light' se false
    theme.global.name.value = systemStore.isDarkMode ? 'dark' : 'light'
  }
</script>
