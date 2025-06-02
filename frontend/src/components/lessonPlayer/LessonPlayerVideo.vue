<template>
  <v-responsive
    v-if="lesson?.content_url"
    :aspect-ratio="16 / 9"
    class="rounded-lg overflow-hidden elevation-4"
  >
    <!-- Player de vídeo nativo -->
    <video
      ref="videoRef"
      :src="getUrl(lesson.content_url)"
      autoplay
      muted
      controls
      @loadedmetadata="onLoaded"
      class="w-100 h-100 d-block"
    />
  </v-responsive>
</template>

<script setup>
/**
 * LessonPlayerVideo.vue
 *
 * Player para conteúdos em vídeo nativo (.mp4, etc.).
 * Usa evento `loadedmetadata` para garantir que o vídeo esteja carregado
 * antes de adicionar listener de finalização (`ended`).
 *
 * Quando o vídeo finaliza, emite o evento `completed` para a aplicação.
 */

// Imports
import { ref, onBeforeUnmount } from 'vue'
import { getUrl } from '@/utils/url'

// 🎯 Props & Emits
const props = defineProps({ lesson: Object })
const emit = defineEmits(['completed'])

// Referência ao elemento <video>
const videoRef = ref(null)

// Emite o evento 'completed' quando o vídeo termina.
const emitCompleted = () => {
  console.log('[LessonPlayerVideo] Vídeo finalizado — emitindo "completed"')
  emit('completed')
}

/**
 * Quando os metadados do vídeo estiverem disponíveis.
 *
 * Esse evento garante que o vídeo está totalmente carregado e pronto para manipulação.
 * Após isso, adicionamos um listener para o evento 'ended' (fim do vídeo).
 * Também armazenamos uma função de limpeza para ser usada no unmount.
 *
 * @param {Event} event - Evento disparado pelo carregamento do vídeo
 */
const onLoaded = ({ target: video }) => {
  if (!video) return
  video.addEventListener('ended', emitCompleted)
  video._cleanup = () => video.removeEventListener('ended', emitCompleted)
}

// 🧹 Limpeza do listener quando o componente for desmontado
onBeforeUnmount(() => {
  videoRef.value?._cleanup?.()
})
</script>
