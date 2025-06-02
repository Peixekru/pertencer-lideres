<template>
  <component
    :is="resolvedComponent"
    :lesson="lesson"
    @completed="$emit('completed')"
  />
</template>

<script setup>
/**
 * LessonPlayer.vue
 *
 * Componente bridge entre `LessonView` e os componentes de player específicos.
 * Atua como um "roteador de players", renderizando dinamicamente o player ideal
 * com base no tipo de conteúdo da lição (`lesson.content_type`).
 *
 * Também repassa o evento `completed` para o componente pai.
 */

// Imports
import { computed } from 'vue'
import LessonPlayerVideo from './LessonPlayerVideo.vue'
import LessonPlayerVimeo from './LessonPlayerVimeo.vue'
import LessonPlayerRise from './LessonPlayerRise.vue'
import LessonPlayerStoryline from './LessonPlayerStoryline.vue'
import LessonPlayerUnsupported from './LessonPlayerUnsupported.vue'

// Props & Emits
const props = defineProps({
  lesson: Object,
})
const emit = defineEmits(['completed', 'fullscreen-toggle'])

// Mapeamento de tipo → componente
const componentMap = {
  video: LessonPlayerVideo,
  vimeo: LessonPlayerVimeo,
  rise: LessonPlayerRise,
  storyline: LessonPlayerStoryline,
}

//Computa o componente apropriado com base no tipo de conteúdo da lição
const resolvedComponent = computed(() => {
  const type = props.lesson?.content_type // Recebe o tipo da lição e retorna o componente correspondente
  const component = componentMap[type] || LessonPlayerUnsupported // Se o tipo não for suportado, retorna o componente de fallback
  return component
})
</script>
