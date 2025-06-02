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
        <!-- Cabeçalho da lição -->
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

        <!-- Componente que renderiza o player específico da lição -->
        <v-container
          class="pa-0 mt-6"
          v-if="lessonDetails"
        >
          <LessonPlayer
            :lesson="lessonDetails"
            @completed="handleCompleted"
          />
        </v-container>
      </v-col>
    </v-row>

    <!-- Footer com navegação e avaliação -->
    <LessonFooter
      :goToCourseAfterUnit="goToCourseAfterUnit"
      :isUnitFinished="progressStore.isUnitFinished"
      :nextLesson="progressStore.nextLesson"
      :nextTitle="nextLessonTitle"
      :isCompleted="isCompleted"
      :rating="userRating"
      @next="handleNextLesson"
      @rating="handleRating"
    />
  </v-container>
</template>

<script setup>
/**
 * LessonView.vue
 *
 * Página principal que renderiza a lição atual.
 * Define o título, renderiza o player dinâmico, e controla:
 * - Progresso do curso
 * - Navegação entre lições
 * - Avaliação da lição (Rating)
 */

// Imports
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useProgressStore } from '@/store/progress'
import { useLessonStore } from '@/store/lesson'
import { useCourseStore } from '@/store/course'
import LessonPlayer from '@/components/lessonPlayer/LessonPlayer.vue'
import LessonFooter from '@/components/LessonFooter.vue'

// Roteamento e stores
const route = useRoute()
const router = useRouter()
const progressStore = useProgressStore()
const lessonStore = useLessonStore()
const courseStore = useCourseStore()

// Dados da lição atual
const lessonId = computed(() => Number(route.params.lessonId))
const { lessonDetails } = storeToRefs(lessonStore)
const isCompleted = computed(() => progressStore.getLessonById(lessonId.value)?.is_completed === 1)

// Avaliação do usuário
const userRating = ref(0)

// Envia avaliação do usuário para a lição atual
async function handleRating(rating) {
  userRating.value = rating
  await lessonStore.rateLesson(lessonId.value, rating)
  const index = lessonStore.lessons.findIndex((l) => l.id === lessonId.value)
  if (index !== -1) lessonStore.lessons[index].rating = rating
}

// Marca a lição como completa
function handleCompleted() {
  progressStore.completeLessonAndRefresh(lessonId.value)
}

// Configuração de navegação
const goToCourseAfterUnit = false
const nextLessonTitle = computed(() => progressStore.nextLesson?.title || '')

// Avança para a próxima lição ou unidade
function handleNextLesson() {
  console.log('Avançando para a lição:', progressStore.nextLesson)

  if (progressStore.isUnitFinished) {
    if (goToCourseAfterUnit) {
      router.push('/course')
    } else {
      const nextUnitFirstLesson = progressStore.getNextUnitFirstLesson(lessonId.value)
      if (nextUnitFirstLesson) {
        router.push(`/lesson/${nextUnitFirstLesson.id}`)
      } else {
        router.push('/course') // fallback
      }
    }
  } else if (progressStore.nextLesson?.id) {
    router.push(`/lesson/${progressStore.nextLesson.id}`)
  }
}

// Watcher: Reage à mudança de ID na rota para carregar os dados da nova lição
watch(
  () => lessonId.value,
  async (id, _, onCleanup) => {
    if (!id) return

    // Carrega progresso do curso se ainda não tiver
    if (!progressStore.progressData) {
      const courseId = courseStore.currentCourse?.id
      if (courseId) await progressStore.fetchCourseProgress(courseId)
    }

    const unitId = progressStore.getUnitIdByLessonId(id)
    if (!unitId) return

    // Carrega detalhes e lista de lições
    let lesson = lessonDetails.value
    if (!lesson || lesson.id !== id) {
      lesson = await lessonStore.fetchLessonDetails(unitId, id)
      userRating.value = lesson?.rating || 0
    }

    await lessonStore.fetchLessons(unitId)
    progressStore.calculateFlow(id)
  },
  { immediate: true }
)

// Carrega progresso do curso ao montar a view (caso ainda não carregado)

onMounted(async () => {
  if (!progressStore.progressData) {
    const courseId = courseStore.currentCourse?.id
    if (courseId) await progressStore.fetchCourseProgress(courseId)
  }
})
</script>