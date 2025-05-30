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
            <h1 class="text-h1-70 font-weight-medium text-primary">01</h1>
          </v-col>

          <v-col class="ms-4">
            <v-row
              no-gutters
              align="center"
            >
              <h4 class="text-h4-20 text-primary mt-1">
                {{ lessonDetails?.title || 'Lição não encontrada' }}
              </h4>
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
            <p class="mt-1 text-primary">Título da lição</p>
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
    <LessonFooter
      :isCompleted="isCompleted"
      :isUnitFinished="isUnitFinished"
      :nextTitle="nextLessonTitle"
      :nextLesson="nextLesson"
      @next="handleNextLesson"
    />
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
import LessonFooter from '@/components/LessonFooter.vue'
import logger from '#logger'

const route = useRoute()
const router = useRouter()
const videoRef = ref(null)

const progressStore = useProgressStore()
const lessonStore = useLessonStore()
const courseStore = useCourseStore()

const lessonId = computed(() => Number(route.params.lessonId))
//const unitId = computed(() => progressStore.getUnitIdByLessonId(lessonId))

const { lessonDetails } = storeToRefs(lessonStore)
const lessonType = computed(() => lessonDetails.value?.content_type)
const isCompleted = computed(() => progressStore.getLessonById(lessonId.value)?.is_completed === 1)

const goBack = () => router.back()
const markAsCompleted = async () => {
  if (!isCompleted.value) await lessonStore.completeLesson(lessonId.value)
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

// Estado para footer
const nextLesson = ref(null)
const isUnitFinished = ref(false)
const isFinished = ref(false)
const userRating = ref(0)
const nextLessonTitle = computed(() => nextLesson.value?.title || '')

// Handler do botão próximo
function handleNextLesson() {
  console.log('Avançando para a lição:', nextLesson.value)
  if (isUnitFinished.value) {
    router.push('/course')
  } else if (nextLesson.value?.id) {
    router.push(`/lesson/${nextLesson.value.id}`)
  }
}

/**
 * Observa mudança de lessonId (navegação entre lições)
 * - Garante carregamento do conteúdo correto
 * - Ativa o listener apropriado conforme o tipo de lição
 */
watch(
  () => lessonId.value,
  async (id, _, onCleanup) => {
    if (!id) return

    // Garante que o progresso do curso esteja carregado
    if (!progressStore.progressData) {
      const courseId = courseStore.currentCourse?.id
      if (courseId) await progressStore.fetchCourseProgress(courseId)
    }

    // Busca o ID da unidade com base na lessonId atual
    const unitId = progressStore.getUnitIdByLessonId(id)

    // Verifica se conseguiu identificar a unidade
    if (!unitId) {
      console.warn('UnitId não encontrado para lessonId:', id)
      return
    }

    // Garante que os detalhes da lição atual estejam carregados
    let lesson = lessonDetails.value
    if (!lesson || lesson.id !== lessonId) {
      lesson = await lessonStore.fetchLessonDetails(unitId, id)
    }

    // Busca todas as lições da unidade
    await lessonStore.fetchLessons(unitId)

    // Filtra as lições da unidade e ordena pelo índice de ordem
    const lessons = lessonStore.lessons
      .filter((l) => l.unit_id === unitId)
      .sort((a, b) => a.order_index - b.order_index)

    // Identifica o índice da lição atual na lista ordenada
    const currentIndex = lessons.findIndex((l) => l.id === id)

    // Obtém a próxima lição, se houver
    const nextLessonData = lessons[currentIndex + 1]

    // Atualiza o estado com os dados da próxima lição
    if (nextLessonData) {
      nextLesson.value = {
        title: nextLessonData.title,
        id: nextLessonData.id,
      }
      isUnitFinished.value = false
    } else {
      // Se não houver próxima lição, marca unidade como concluída
      nextLesson.value = null
      isUnitFinished.value = true
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
