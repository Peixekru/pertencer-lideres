<template>
  <v-btn @click="toggleTheme" variant="outlined"
    :prepend-icon="theme.global.name.value === 'dark' ? 'mdi-weather-night' : 'mdi-weather-sunny'" class="mb-4">
    `{{ theme.global.name.value }} mode`
  </v-btn>
</template>

<script setup>
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.name.value === 'light' ? 'dark' : 'light'
}
</script>