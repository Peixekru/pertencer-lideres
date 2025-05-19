<template>
  <v-container
    fluid
    class="py-8"
    style="max-width: 1280px; margin: 0 auto"
  >
    <v-row
      justify="center"
      class="mt-4"
    >
      <v-col
        cols="12"
        md="12"
      >
        <!-- Título da lição -->
        <v-row no-gutters>
          <v-col cols="auto">
            <v-text class="text-h1-70 font-weight-medium text-primary">01</v-text>
          </v-col>

          <v-col class="ms-4">
            <v-row
              no-gutters
              align="center"
            >
              <v-text class="text-h4-20 text-primary mt-1">
                {{ lessonDetails?.title || 'Lição não encontrada' }}
              </v-text>
              <span class="text-overline text-primary ms-4 mt-3">(ID: {{ lessonId }})</span>
              <v-icon
                v-if="isCompleted"
                size="16"
                color="success"
                class="ms-2 mt-3"
              >
                mdi-check-circle
              </v-icon>
            </v-row>
            <v-text class="mt-1 text-primary">Título da lição</v-text>
          </v-col>
        </v-row>

        <!-- Conteúdo da lição -->
        <v-container
          class="pa-0 mt-6"
          v-if="lessonDetails"
        >
          <!-- Tipo Vídeo -->
          <template v-if="lessonType === 'video'">
            <v-responsive
              :aspect-ratio="16 / 9"
              class="rounded-lg overflow-hidden elevation-4"
            >
              <video
                ref="videoRef"
                :src="getUrl(lessonDetails.content_url)"
                autoplay
                muted
                controls
                class="w-100 h-100 d-block"
              />
            </v-responsive>
          </template>

          <!-- Tipo Vimeo -->
          <template v-else-if="lessonType === 'vimeo'">
            <v-responsive
              :aspect-ratio="16 / 9"
              class="rounded-lg overflow-hidden elevation-4"
            >
              <iframe
                :src="lessonDetails.content_url"
                title="Conteúdo vimeo"
                allow="autoplay; fullscreen; picture-in-picture"
                frameborder="0"
                allowfullscreen
                class="w-100 h-100 d-block"
              />
            </v-responsive>
          </template>

          <!-- Tipo Rise -->
          <template v-else-if="lessonType === 'rise'">
            <v-sheet
              elevation="6"
              class="iframe-fixed iframe-centered"
              :class="isFullscreen ? 'fullscreen w-100' : 'layout-max-width mt-40'"
            >
              <!-- Botão Fullscreen -->
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

              <iframe
                :src="getUrl(lessonDetails.content_url)"
                class="w-100 border-0"
                :class="isFullscreen ? 'h-100' : 'h-100-mt-40'"
                title="Conteúdo rise"
              />
            </v-sheet>
          </template>

          <!-- Tipo Storyline -->
          <template v-else-if="lessonType === 'storyline'">
            <v-responsive
              :aspect-ratio="16 / 9"
              class="rounded-lg overflow-hidden elevation-4"
            >
              <iframe
                :src="getUrl(lessonDetails.content_url)"
                title="Conteúdo storyline"
                frameborder="0"
                class="w-100 h-100 d-block"
              />
            </v-responsive>
          </template>

          <!-- Tipo inválido -->
          <template v-else>
            <p>Tipo de conteúdo não suportado.</p>
          </template>
        </v-container>

        <!-- Botão de concluir -->
        <!--<v-btn
          color="primary"
          class="mt-6"
          :disabled="isCompleted"
          @click="markAsCompleted"
        >
          <v-icon left>mdi-check</v-icon>
          {{ isCompleted ? 'Concluído' : 'Concluir Lição' }}
        </v-btn>-->
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useProgressStore } from '@/store/progress'
import { useLessonStore } from '@/store/lesson'
import { useCourseStore } from '@/store/course'
import { initVimeoPlayer } from '@/utils/vimeo'
import { getUrl } from '@/utils/url'
import logger from '#logger'

const route = useRoute()
const router = useRouter()
const videoRef = ref(null)

const progressStore = useProgressStore()
const lessonStore = useLessonStore()
const courseStore = useCourseStore()

const lessonId = Number(route.params.lessonId)
//const unitId = computed(() => progressStore.getUnitIdByLessonId(lessonId))
const { lessonDetails } = storeToRefs(lessonStore)
const lessonType = computed(() => lessonDetails.value?.content_type)
const isCompleted = computed(() => progressStore.getLessonById(lessonId)?.is_completed === 1)

const goBack = () => router.back()
const markAsCompleted = async () => {
  if (!isCompleted.value) await lessonStore.completeLesson(lessonId)
}

// Lógica de tela cheia Rise
const isFullscreen = ref(false)
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// Lógica de captura de progresso Rise
const handleRiseProgress = (event) => {
  const data = event.data
  if (data?.type === 'update' && data.payload?.totalProgress?.percentComplete === 100) {
    logger.stInf('Lesson progress:', `${data.payload.totalProgress.percentComplete}% complete`)
    markAsCompleted()
  }
}

// Lógica de captura de progresso Storyline
const handleStorylineProgress = (event) => {
  const data = event.data
  if (data?.type === 'SCORM_PROGRESS') {
    const status = data.payload['cmi.core.lesson_status']
    logger.stDeb('Storyline SCORM progress:', status)

    if (status === 'completed' || status === 'passed') {
      markAsCompleted()
    }
  }
}

/**
 * Observa mudança de lessonId (navegação entre lições)
 * - Garante carregamento do conteúdo correto
 * - Ativa o listener apropriado conforme o tipo de lição
 */
watch(
  () => lessonId,
  async (id, _, onCleanup) => {
    if (!id) return

    // Só busca se lessonDetails não estiver carregada ou for de outra lição
    let lesson = lessonDetails.value
    if (!lesson || lesson.id !== lessonId) {
      // Busca os detalhes da lição
      const unitId = progressStore.getUnitIdByLessonId(id)
      lesson = await lessonStore.fetchLessonDetails(unitId, id)
    }

    if (lesson.content_type === 'vimeo') {
      /**
       * Inicializa player do Vimeo e escuta evento de conclusão.
       * Utiliza abordagem direta via DOM (como no projeto legado).
       * Evita uso de refs e problemas de reatividade/navegação.
       */
      await initVimeoPlayer(() => markAsCompleted())
    }

    if (lesson?.content_type === 'video') {
      await nextTick()
      const video = videoRef.value
      if (video && !isCompleted.value) {
        video.addEventListener('ended', markAsCompleted)
        onCleanup(() => video.removeEventListener('ended', markAsCompleted))
      }
    }

    if (lesson?.content_type === 'rise') {
      window.addEventListener('message', handleRiseProgress)
      onCleanup(() => window.removeEventListener('message', handleRiseProgress))
    }

    if (lesson?.content_type === 'storyline') {
      window.addEventListener('message', handleStorylineProgress)
      onCleanup(() => window.removeEventListener('message', handleStorylineProgress))
    }
  },
  { immediate: true }
)

onMounted(async () => {
  if (!progressStore.progressData) {
    const courseId = courseStore.currentCourse?.id
    if (courseId) await progressStore.fetchCourseProgress(courseId)
  }
})
</script>

<style lang="scss" scoped>
// Alinhamento da tela cheia Rise
.mt-40 {
  margin-top: 160px;
}
.h-100-mt-40 {
  height: calc(100% - 160px);
}
</style>
