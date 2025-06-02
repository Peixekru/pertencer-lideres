<template>
  <v-responsive
    :aspect-ratio="16 / 9"
    class="rounded-lg overflow-hidden elevation-4"
  >
    <!-- Iframe do conteúdo Vimeo -->
    <iframe
      :src="lesson.content_url"
      title="Conteúdo Vimeo"
      allow="autoplay; fullscreen; picture-in-picture"
      frameborder="0"
      allowfullscreen
      class="w-100 h-100 d-block"
    />
  </v-responsive>
</template>

<script setup>
/**
 * LessonPlayerVimeo.vue
 *
 * Player para conteúdos Vimeo. Integra com a API oficial (player.js)
 * para escutar o evento 'ended' e emitir `completed` para a aplicação.
 */

// Imports
import { onMounted } from 'vue'
import { initVimeoPlayer } from '@/utils/vimeo'

// Props & Emits
const props = defineProps({ lesson: Object })
const emit = defineEmits(['completed'])

// Inicia o player Vimeo via API e escuta término do vídeo
onMounted(() => {
  initVimeoPlayer(() => {
    console.log('[LessonPlayerVimeo] Vídeo finalizado — emitindo "completed"')
    emit('completed')
  })
})
</script>
