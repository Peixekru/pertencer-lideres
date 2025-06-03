<template>
  <v-sheet
    elevation="6"
    class="iframe-fixed iframe-centered"
    :class="isFullscreen ? 'fullscreen w-100' : 'layout-max-width mt-40'"
  >
    <!-- Botão de alternância fullscreen -->
    <v-btn
      icon
      elevation="6"
      size="small"
      class="position-absolute"
      style="right: 12px; z-index: 10"
      :style="isFullscreen ? 'top: 10px;' : 'top: -20px;'"
      @click="toggleFullscreen"
      :aria-label="isFullscreen ? 'Sair do modo tela cheia' : 'Expandir para tela cheia'"
    >
      <v-icon color="primary">
        {{ isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}
      </v-icon>
    </v-btn>

    <!-- Iframe do conteúdo Rise -->
    <iframe
      :src="getUrl(lesson.content_url)"
      class="w-100 border-0"
      :class="isFullscreen ? 'h-100' : 'h-100-mt-40'"
      title="Conteúdo Rise"
    />
  </v-sheet>
</template>

<script setup>
/**
 * LessonPlayerRise.vue
 *
 * Player especializado para conteúdos do tipo "Rise".
 * Gerencia fullscreen localmente e escuta mensagens postadas via window
 * para detectar progresso de 100% e emitir o evento `completed`.
 */

// Imports
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getUrl } from '@/utils/url'

// Props & Emits
const props = defineProps({ lesson: Object })
const emit = defineEmits(['completed'])

// Estado local de fullscreen
const isFullscreen = ref(false)
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

/**
 * Escuta mensagens do iframe Rise e emite 'completed' ao atingir 100%.
 * Espera mensagens postadas via `window.postMessage`.
 *
 * @param {MessageEvent} event - Evento disparado pelo iframe Rise
 */
function handleRiseProgress(event) {
  const data = event.data
  const percent = data?.payload?.totalProgress?.percentComplete
  if (data?.type === 'update' && percent === 100) {
    console.log('[LessonPlayerRise] Conteúdo Rise finalizado — emitindo "completed"')
    emit('completed')
  }
}

// Lifecycle: adiciona e remove listener da janela
onMounted(() => {
  window.addEventListener('message', handleRiseProgress)
})
onBeforeUnmount(() => {
  window.removeEventListener('message', handleRiseProgress)
})
</script>

<style lang="scss" scoped>
.mt-40 {
  margin-top: 160px;
}
.h-100-mt-40 {
  height: calc(100% - 160px);
}
</style>
