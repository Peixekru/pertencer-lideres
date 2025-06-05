<template>
  <div class="text-center">
    <v-icon
      size="48"
      color="primary"
      class="mb-4"
    >
      mdi-progress-clock
    </v-icon>
    <h3 class="text-h6 mb-2">{{ title }}</h3>
    <p class="text-body-2 my-6">Estamos desenvolvendo essa área com muito carinho. Fique ligado!</p>
    <v-btn
      rounded
      size="small"
      color="primary"
      class="px-8"
      @click="$emit('close')"
    >
      Fechar
    </v-btn>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Aviso',
  },
})
</script>
