<template>
  <v-app :theme="theme.global.name.value">
    <RouterView />
  </v-app>
</template>

<script setup>
  import { useTheme } from 'vuetify'
  const theme = useTheme()
</script>

<style lang="scss">
  @use '@/assets/styles/global.scss' as *;
</style>
