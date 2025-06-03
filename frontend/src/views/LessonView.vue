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
      :nextLesson="nextLesson"
      :nextTitle="nextLesson?.title || ''"
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
 * Página que exibe a lição atual.
 * Responsável por:
 * - Renderizar o conteúdo da lição
 * - Controlar progresso e navegação
 * - Gerenciar a avaliação (rating)
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
import { resolveNextLessonFromMapped } from '@/domain/lesson/resolveNextLessonFromMapped'

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

/**
 * Envia a avaliação (rating) do usuário para a lição atual.
 * Atualiza também a store local após envio ao backend.
 */
async function handleRating(rating) {
  userRating.value = rating
  await lessonStore.rateLesson(lessonId.value, rating)

  const index = lessonStore.lessons.findIndex((l) => l.id === lessonId.value)
  if (index !== -1) lessonStore.lessons[index].rating = rating
}

/**
 * Marca a lição como concluída e atualiza o progresso do curso.
 */
function handleCompleted() {
  progressStore.completeLessonAndRefresh(lessonId.value)
}

/**
 * Define o comportamento de navegação ao final da unidade.
 * - true: encerra na unidade atual e redireciona para /course
 * - false: continua para a próxima lição desbloqueada (mesmo de outra unidade)
 */
const goToCourseAfterUnit = true

/**
 * Lição seguinte desbloqueada com base na lição atual e no modo de navegação.
 *
 * - Usa regras de desbloqueio baseadas em conclusão anterior (via `resolveNextLessonFromMapped`)
 * - Modo `"continuous"` avança linearmente entre unidades
 * - Modo `"restricted"` limita o avanço à mesma unidade, redirecionando ao final
 *
 * O resultado controla a navegação via `handleNextLesson` e também alimenta o componente `LessonFooter`.
 *
 * @type {import('@/domain/lesson/mapLessonsWithLockState').MappedLesson | null}
 */
const nextLesson = computed(() =>
  resolveNextLessonFromMapped(
    lessonStore.lessons,
    lessonId.value,
    goToCourseAfterUnit ? 'restricted' : 'continuous'
  )
)

/**
 * Avança para a próxima lição desbloqueada ou redireciona para o curso.
 * Baseado no valor computado de `nextLesson`.
 */
function handleNextLesson() {
  if (nextLesson.value) {
    router.push({ name: 'Lesson', params: { lessonId: nextLesson.value.id } })
  } else {
    router.push('/course')
  }
}

/**
 * Watcher:
 * Reage à mudança de rota (lessonId) para:
 * - Garantir que progresso e dados estejam carregados
 * - Buscar detalhes e lições da unidade
 * - Atualizar avaliação local
 * - Calcular fluxo de navegação
 */
watch(
  () => lessonId.value,
  async (id) => {
    // Se não houver ID, sai da função
    if (!id) return

    // Garante que o progresso do curso esteja carregado
    if (!progressStore.progressData) {
      const courseId = courseStore.currentCourse?.id
      if (courseId) await progressStore.fetchCourseProgress(courseId)
    }

    // Recupera a unidade da lição
    const unitId = progressStore.getUnitIdByLessonId(id)
    if (!unitId) return

    // Carrega os detalhes da lição se ainda não estiverem atualizados
    let lesson = lessonDetails.value
    if (!lesson || lesson.id !== id) {
      lesson = await lessonStore.fetchLessonDetails(unitId, id)
    }

    // Atualiza o rating local mesmo se o lessonDetails já estiver disponível
    userRating.value = lesson?.rating || 0

    // Garante que as lições da unidade estejam carregadas
    await lessonStore.fetchLessons(unitId)
  },
  // Configuração inicial: carrega imediatamente
  { immediate: true }
)

/**
 * onMounted:
 * Garante que o progresso do curso seja carregado ao montar a view
 */
onMounted(async () => {
  if (!progressStore.progressData) {
    const courseId = courseStore.currentCourse?.id
    if (courseId) await progressStore.fetchCourseProgress(courseId)
  }
})
</script>
