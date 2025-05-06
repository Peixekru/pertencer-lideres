<template>
  <v-app>
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
