<template>
  <!-- Alerta de conteúdo não suportado -->
  <v-alert
    type="warning"
    class="mt-4"
    title="Conteúdo não suportado"
    text="Este tipo de lição ainda não está disponível para visualização."
  />
</template>

<script setup>
/**
 * LessonPlayerUnsupported.vue
 *
 * Componente de fallback renderizado quando o tipo de conteúdo da lição
 * não é reconhecido ou ainda não tem player implementado.
 *
 * Serve como alerta visual para o usuário e previne quebra de fluxo.
 */

import { onMounted } from 'vue'

// Emite o evento 'completed' se quisermos permitir continuar mesmo sem player
// const emit = defineEmits(['completed'])

// onMounted(() => {
//   console.log('[LessonPlayerUnsupported] Emitindo "completed" automaticamente')
//   emit('completed')
// })
</script>
