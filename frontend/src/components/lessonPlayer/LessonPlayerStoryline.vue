<template>
  <v-responsive
    :aspect-ratio="16 / 9"
    class="rounded-lg overflow-hidden elevation-4"
  >
    <!-- Iframe do conteúdo Storyline -->
    <iframe
      :src="getUrl(lesson.content_url)"
      title="Conteúdo Storyline"
      frameborder="0"
      allowfullscreen
      class="w-100 h-100 d-block"
    />
  </v-responsive>
</template>

<script setup>
/**
 * LessonPlayerStoryline.vue
 *
 * Player especializado para conteúdos do tipo "Storyline".
 * Escuta mensagens postadas via window para detectar progresso
 * de SCORM e emitir `completed` quando o status for "completed" ou "passed".
 */

// Imports
import { onMounted, onBeforeUnmount } from 'vue'
import { getUrl } from '@/utils/url'

// Props & Emits
const props = defineProps({ lesson: Object })
const emit = defineEmits(['completed'])

/**
 * Escuta mensagens do iframe Storyline e emite 'completed'
 * se o SCORM indicar status de conclusão.
 *
 * @param {MessageEvent} event - Evento disparado pelo iframe Storyline
 */
function handleStorylineProgress(event) {
  const status = event.data?.payload?.['cmi.core.lesson_status']
  if (status === 'completed' || status === 'passed') {
    console.log('[LessonPlayerStoryline] Conteúdo finalizado — emitindo "completed"')
    emit('completed')
  }
}

// Lifecycle: adiciona e remove listener da janela
onMounted(() => {
  window.addEventListener('message', handleStorylineProgress)
})
onBeforeUnmount(() => {
  window.removeEventListener('message', handleStorylineProgress)
})
</script>
