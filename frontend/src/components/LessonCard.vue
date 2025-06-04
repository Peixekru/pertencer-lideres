<template>
  <v-card
    class="rounded-lg lesson-card"
    :class="highlight && 'highlight'"
    :elevation="2"
    :disabled="lesson.isLocked"
    :to="!lesson.isLocked ? { name: 'Lesson', params: { lessonId: lesson.id } } : undefined"
    link
  >
    <!-- Imagem de fundo ou placeholder -->
    <v-img
      :src="getUrl(lesson.image_url) || placeholder"
      height="180"
      aspect-ratio="16/9"
      cover
      class="lesson-card__image"
      :lazy-src="placeholder"
    >
      <!-- Ícone de bloqueio -->
      <template #default>
        <div
          v-if="lesson.isLocked"
          class="lesson-card__overlay d-flex justify-center align-center"
        >
          <v-icon
            size="32"
            color="white"
            class="mt-4"
          >
            mdi-lock-outline
          </v-icon>
        </div>

        <!-- Ícone de check se concluída -->
        <v-icon
          v-if="lesson.completed && !lesson.isLocked"
          class="lesson-card__check"
          color="white"
        >
          mdi-check-circle
        </v-icon>
      </template>
    </v-img>

    <!-- Rodapé com título e tempo -->
    <v-card-actions
      class="lesson-card__footer px-4 d-flex justify-space-between align-center bg-accent"
    >
      <span class="text-white text-body-2 font-weight-medium">
        {{ lesson.title }}
      </span>
      <span class="text-white text-caption d-flex align-center">
        <v-icon
          size="16"
          class="me-1"
        >
          mdi-clock-outline
        </v-icon>
        {{ lesson.duration || '—' }}
      </span>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { getUrl } from '@/utils/url'

const props = defineProps({
  lesson: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
  highlight: {
    type: Boolean,
    default: false,
  },
  dense: {
    type: Boolean,
    default: false,
  },
})

const placeholder = 'https://placehold.co/500x300?text=Loaging...'
</script>

<style scoped>
.lesson-card {
  transition: 0.2s ease-in-out;
  cursor: pointer;
  overflow: hidden;
  border-start-end-radius: 22px !important;
}
.lesson-card__image {
  position: relative;
}
.lesson-card__check {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}
.lesson-card.highlight {
  outline: 3px solid #4fc3f7;
  transform: scale(1.02);
  transition: all 0.5s ease-in-out;
  z-index: 2;
}
.lesson-card__overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(43, 112, 128, 0.6);
  z-index: 1;
}
.lesson-card__footer {
  min-height: 40px !important;
}
</style>
